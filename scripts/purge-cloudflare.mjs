/**
 * scripts/purge-cloudflare.mjs — onuraksoy.com.tr Cloudflare önbelleğini ELLE temizler (AGENTS.md §7.3).
 *
 * CI'da otomatik purge yoktur. Her canlı yayından (GitHub Actions deploy işi ✅) sonra yerelden çalıştırılır:
 *   npm run cf:purge                 # tüm önbellek (purge_everything)
 *   npm run cf:purge -- /rss.xml /   # yalnızca verilen yollar
 *
 * Token kaynağı (sırayla): $CF_ZONE_ADMIN_TOKEN → %APPDATA%/xdg.config/.wrangler/config/zone_admin_token.txt
 * Token değeri hiçbir zaman yazdırılmaz, dosyaya/commit'e eklenmez ve GitHub secret'ı yapılmaz.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ZONE_ID = '35e77f8c11e66b311176fc3e73d9dfbb'; // onuraksoy.com.tr
const SITE = 'https://onuraksoy.com.tr';

function readToken() {
  if (process.env.CF_ZONE_ADMIN_TOKEN) return process.env.CF_ZONE_ADMIN_TOKEN.trim();
  const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
  const file = path.join(appData, 'xdg.config', '.wrangler', 'config', 'zone_admin_token.txt');
  if (fs.existsSync(file)) return fs.readFileSync(file, 'utf8').trim();
  return null;
}

const token = readToken();
if (!token) {
  console.error('❌ Cloudflare token bulunamadı ($CF_ZONE_ADMIN_TOKEN veya wrangler config/zone_admin_token.txt).');
  process.exit(1);
}

const paths = process.argv.slice(2).filter((a) => a.startsWith('/'));
const body = paths.length ? { files: paths.map((p) => `${SITE}${p}`) } : { purge_everything: true };

const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});
const json = await res.json().catch(() => ({}));
if (!json.success) {
  console.error(`❌ Purge başarısız: HTTP ${res.status} ${JSON.stringify(json.errors || [])}`);
  process.exit(1);
}
console.log(`✅ Cloudflare önbelleği temizlendi (${paths.length ? paths.join(', ') : 'tümü'}).`);
