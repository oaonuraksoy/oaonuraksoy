// @ts-check
/**
 * src/utils/image-meta.mjs — og:image / JSON-LD ImageObject için gerçek görsel boyutu ve MIME tipi.
 *
 * Kural (AGENTS.md §7.2): og:image:width/height ve ImageObject width/height değerleri elle
 * yazılmaz; dosya başlığından okunur. Böylece beyan edilen boyut ile gerçek dosya hiçbir zaman
 * ayrışmaz. Bağımlılıksız, senkron JPEG/PNG/WebP başlık okuyucusu.
 */
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://onuraksoy.com.tr';

/** @type {Record<string, string>} */
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' };

/** Bilinen harici görseller (YouTube küçük resimleri). */
const REMOTE = [
  { re: /i\.ytimg\.com\/vi\/[^/]+\/maxresdefault\.jpg$/, width: 1280, height: 720 },
  { re: /i\.ytimg\.com\/vi\/[^/]+\/hqdefault\.jpg$/, width: 480, height: 360 }
];

/** @param {Buffer} b */
function readSize(b) {
  // PNG
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  // WebP
  if (b.length > 30 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = b.toString('ascii', 12, 16);
    if (chunk === 'VP8X') return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
    if (chunk === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L') {
      const bits = b.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
  }
  // JPEG
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
      }
      i += 2 + len;
    }
  }
  return null;
}

/** @type {Map<string, any>} */
const cache = new Map();

/**
 * @param {string} url Mutlak (https://onuraksoy.com.tr/...) ya da kök-göreli (/images/...) görsel yolu
 * @returns {{ url: string, width?: number, height?: number, type?: string, local: boolean, exists: boolean }}
 */
export function imageMeta(url) {
  const abs = url.startsWith('http') ? url : `${SITE}${url.startsWith('/') ? '' : '/'}${url}`;
  if (cache.has(abs)) return cache.get(abs);
  const ext = path.extname(new URL(abs).pathname).toLowerCase();
  /** @type {any} */
  let meta = { url: abs, type: MIME[ext], local: false, exists: true };
  if (abs.startsWith(SITE)) {
    const file = path.join(process.cwd(), 'public', decodeURIComponent(new URL(abs).pathname));
    meta.local = true;
    meta.exists = fs.existsSync(file);
    if (meta.exists) {
      const fd = fs.openSync(file, 'r');
      const buf = Buffer.alloc(256 * 1024);
      const n = fs.readSync(fd, buf, 0, buf.length, 0);
      fs.closeSync(fd);
      Object.assign(meta, readSize(buf.subarray(0, n)) || {});
    }
  } else {
    const known = REMOTE.find((r) => r.re.test(abs));
    if (known) Object.assign(meta, { width: known.width, height: known.height });
  }
  cache.set(abs, meta);
  return meta;
}

/**
 * Bir sayfa görselinin paylaşım (OG) sürümünü döndürür: /images/<dir>/<ad>.webp →
 * /images/og/<dir>/<ad>.jpg (scripts/generate-og-images.mjs çıktısı). Yoksa orijinali.
 * @param {string} url
 */
export function ogVariant(url) {
  const abs = url.startsWith('http') ? url : `${SITE}${url}`;
  const m = abs.match(/^https:\/\/onuraksoy\.com\.tr\/images\/(?:(broadcasts|services)\/)?([^/]+)\.webp$/);
  if (m) {
    const candidate = `${SITE}/images/og/${m[1] ? m[1] + '/' : ''}${m[2]}.jpg`;
    if (imageMeta(candidate).exists) return candidate;
  }
  return abs;
}
