<?php
/**
 * ==============================================================================
 * Domain Expiry Tracker (DET) — Raw Socket WHOIS Client & Normalization Engine
 * Architecture: Onur Aksoy (a.k.a. Hackonomist) — https://onuraksoy.com.tr
 * Repository: https://github.com/oaonuraksoy/domain-expiry-tracker
 * ==============================================================================
 */

declare(strict_types=1);

namespace Det\Engine;

class WhoisSocketClient
{
    /** @var array<string, string> Authoritative TLD server registry */
    private const TLD_REGISTRY = [
        'com' => 'whois.verisign-grs.com',
        'net' => 'whois.verisign-grs.com',
        'org' => 'whois.pir.org',
        'info' => 'whois.afilias.net',
        'biz' => 'whois.nic.biz',
        'io' => 'whois.nic.io',
        'co' => 'whois.nic.co',
        'me' => 'whois.nic.me',
        'dev' => 'whois.nic.google',
        'app' => 'whois.nic.google',
        'xyz' => 'whois.nic.xyz',
        'tr' => 'whois.trabis.gov.tr',
    ];

    /** @var array<string> RegEx patterns matching various registrar expiry formats */
    private const EXPIRY_PATTERNS = [
        '/Registry Expiry Date:\s*([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}[Z]?)/i',
        '/Registrar Registration Expiration Date:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/i',
        '/Expiry Date:\s*([0-9]{2}-[a-zA-Z]{3}-[0-9]{4})/i',
        '/Expiration Date:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/i',
        '/expires:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/i',
        '/Record expires on\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/i',
        '/Bitiş Tarihi:\s*([0-9]{4}-[a-zA-Z]{3}-[0-9]{2})/i',
    ];

    /**
     * Query authoritative WHOIS server via direct raw TCP socket (Port 43)
     */
    public function queryRawWhois(string $domain, int $timeoutSeconds = 10): string
    {
        $domain = strtolower(trim($domain));
        $parts = explode('.', $domain);
        $tld = end($parts);

        if (!isset(self::TLD_REGISTRY[$tld])) {
            throw new \InvalidArgumentException("Unsupported TLD [.$tld] or custom server required.");
        }

        $server = self::TLD_REGISTRY[$tld];
        $socket = @fsockopen($server, 43, $errno, $errstr, (float)$timeoutSeconds);

        if (!$socket) {
            throw new \RuntimeException("Socket connection failed to [$server:43]: $errstr ($errno)");
        }

        stream_set_timeout($socket, $timeoutSeconds);

        // Standard WHOIS query termination is CRLF
        fwrite($socket, $domain . "\r\n");

        $response = '';
        while (!feof($socket)) {
            $chunk = fgets($socket, 4096);
            if ($chunk === false) break;
            $response .= $chunk;
        }

        fclose($socket);
        return $response;
    }

    /**
     * Parse raw text response to obtain a normalized Unix timestamp
     */
    public function extractExpiryTimestamp(string $rawWhois): ?int
    {
        foreach (self::EXPIRY_PATTERNS as $pattern) {
            if (preg_match($pattern, $rawWhois, $matches)) {
                $rawDate = trim($matches[1]);
                $parsed = strtotime($rawDate);
                if ($parsed !== false && $parsed > 0) {
                    return $parsed;
                }
            }
        }
        return null;
    }

    /**
     * Calculate days remaining until domain expiration
     */
    public function calculateDaysRemaining(int $expiryTimestamp): int
    {
        $now = time();
        $diff = $expiryTimestamp - $now;
        return (int)floor($diff / 86400);
    }
}
