/**
 * lan_binary_sync_protocol.cs
 * High-performance binary socket framing for local-first peer synchronization.
 * Part of the Onur Aksoy Systems Architecture Broadcast series.
 */

using System;
using System.IO;
using System.Net.Sockets;
using System.Threading.Tasks;

public enum SyncOpCode : ushort
{
    Heartbeat = 0x0001,
    MutationProposal = 0x0002,
    MutationAck = 0x0003,
    StateReconcileRequest = 0x0004
}

public sealed class LanSyncPacket
{
    public const ushort MagicHeader = 0x504F; // 'OP' in ASCII
    public SyncOpCode OpCode { get; set; }
    public ulong SequenceNumber { get; set; }
    public byte[] Payload { get; set; } = Array.Empty<byte>();

    public byte[] Serialize()
    {
        using var ms = new MemoryStream();
        using var writer = new BinaryWriter(ms);

        writer.Write(MagicHeader);
        writer.Write((ushort)OpCode);
        writer.Write(SequenceNumber);
        writer.Write(Payload.Length);
        writer.Write(Payload);

        uint checksum = SimpleCrc32.Compute(Payload);
        writer.Write(checksum);

        return ms.ToArray();
    }

    public static async Task<LanSyncPacket> ReadFromStreamAsync(NetworkStream stream)
    {
        byte[] headerBuffer = new byte[16]; // Fixed 16-byte framing header
        await stream.ReadExactlyAsync(headerBuffer, 0, headerBuffer.Length);

        using var reader = new BinaryReader(new MemoryStream(headerBuffer));
        ushort magic = reader.ReadUInt16();
        if (magic != MagicHeader) throw new InvalidDataException("Corrupted sync frame magic bytes.");

        SyncOpCode opCode = (SyncOpCode)reader.ReadUInt16();
        ulong seqNo = reader.ReadUInt64();
        int payloadLen = reader.ReadInt32();

        byte[] payload = new byte[payloadLen];
        await stream.ReadExactlyAsync(payload, 0, payloadLen);

        byte[] crcBuffer = new byte[4];
        await stream.ReadExactlyAsync(crcBuffer, 0, 4);
        uint expectedCrc = BitConverter.ToUInt32(crcBuffer, 0);

        if (SimpleCrc32.Compute(payload) != expectedCrc)
        {
            throw new InvalidDataException("Checksum mismatch: Frame corrupted during LAN transit.");
        }

        return new LanSyncPacket { OpCode = opCode, SequenceNumber = seqNo, Payload = payload };
    }
}

public static class SimpleCrc32
{
    private static readonly uint[] Table;

    static SimpleCrc32()
    {
        uint poly = 0xedb88320;
        Table = new uint[256];
        for (uint i = 0; i < 256; i++)
        {
            uint temp = i;
            for (int j = 8; j > 0; j--)
            {
                if ((temp & 1) == 1)
                    temp = (temp >> 1) ^ poly;
                else
                    temp >>= 1;
            }
            Table[i] = temp;
        }
    }

    public static uint Compute(byte[] bytes)
    {
        uint crc = 0xffffffff;
        for (int i = 0; i < bytes.Length; ++i)
        {
            byte index = (byte)((crc & 0xff) ^ bytes[i]);
            crc = (crc >> 8) ^ Table[index];
        }
        return ~crc;
    }
}
