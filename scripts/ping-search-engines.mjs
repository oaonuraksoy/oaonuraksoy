/**
 * scripts/ping-search-engines.mjs — Değişen URL'leri arama motorlarına bildirir (AGENTS.md §7.3).
 *
 *  1. IndexNow (api.indexnow.org) → Bing, Yandex, Seznam, Naver, Yep ve IndexNow tüketen AI arama
 *     motorlarına (ör. ChatGPT Search/Bing altyapısı) TEK istekle dağıtılır.
 *  2. WebSub (pubsubhubbub.appspot.com) → /rss.xml değiştiyse Google ve akış okuyucularına bildirim.
 *
 * Google'ın sitemap "ping" uç noktası 2023'te kapatıldı; Google Indexing API yalnızca
 * JobPosting/BroadcastEvent içindir — bu yüzden Google tarafı sitemap lastmod + WebSub ile beslenir.
 *
 * Kullanım:
 *   node scripts/ping-search-engines.mjs --since <git-ref>   # yalnızca o commit'ten beri değişen sayfalar
 *   node scripts/ping-search-engines.mjs --all               # tüm sayfalar (yalnızca büyük yapısal değişiklikte)
 *   ... --dry-run                                            # gönderim yapmadan listeyi yazdırır
 *
 * CI (.github/workflows/deploy.yml) deploy başarıyla bittikten sonra `--since <önceki commit>` ile çalıştırır.
 */
import { execSync } from 'node:child_process';
import { getRouteSources, routesForChangedFiles } from '../src/utils/content-dates.mjs';
import { SITE_URL } from '../src/data/identity.mjs';

const KEY = 'd8a9f2e4c1b7460395e2a1c8f0b3d7e9';
const HOST = new URL(SITE_URL).host;
const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const ALL = args.includes('--all');
const sinceIdx = args.indexOf('--since');
const SINCE = sinceIdx >= 0 ? args[sinceIdx + 1] : null;

// Tüm sayfaları etkileyen paylaşılan kaynaklar (şablon, kimlik, SEO bileşenleri)
const SITEWIDE = [/^src\/layouts\//, /^src\/components\/(SEO|JsonLd|BroadcastJsonLd|Header|Footer)\.astro$/, /^src\/data\//, /^src\/utils\/schema\.mjs$/];
const FEED_SOURCES = [/^src\/content\//, /^src\/pages\/rss\.xml\.ts$/];

function changedFiles(ref) {
  if (!ref || /^0+$/.test(ref)) return null;
  try {
    return execSync(`git diff --name-only ${ref} HEAD`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().split('\n').filter(Boolean);
  } catch {
    console.warn(`⚠️  ${ref} ile karşılaştırılamadı (sığ klon veya geçersiz ref).`);
    return null;
  }
}

let routes = [];
let feedChanged = false;
if (ALL) {
  routes = [...getRouteSources().keys()];
  feedChanged = true;
} else {
  const files = changedFiles(SINCE);
  if (!files) {
    console.log('ℹ️  Karşılaştırılacak commit yok; bildirim atlandı. Tümü için --all kullanın.');
    process.exit(0);
  }
  routes = files.some((f) => SITEWIDE.some((re) => re.test(f))) ? [...getRouteSources().keys()] : routesForChangedFiles(files);
  feedChanged = files.some((f) => FEED_SOURCES.some((re) => re.test(f)));
}

const urlList = routes.map((r) => `${SITE_URL}${r}`).sort();
console.log(`=== Arama motoru bildirimi (IndexNow + WebSub) — ${urlList.length} URL${DRY ? ' [DRY RUN]' : ''} ===`);
urlList.forEach((u) => console.log('  • ' + u));

async function indexNow() {
  if (!urlList.length) return console.log('IndexNow: değişen sayfa yok, atlandı.');
  if (DRY) return;
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE_URL}/${KEY}.txt`, urlList })
  });
  console.log(`IndexNow: HTTP ${res.status} ${res.statusText}`);
  if (res.status >= 400) process.exitCode = 1;
}

async function webSub() {
  if (!feedChanged) return console.log('WebSub: akış değişmedi, atlandı.');
  if (DRY) return;
  const res = await fetch('https://pubsubhubbub.appspot.com/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ 'hub.mode': 'publish', 'hub.url': `${SITE_URL}/rss.xml` }).toString()
  });
  console.log(`WebSub (rss.xml): HTTP ${res.status} ${res.statusText}`);
  if (res.status >= 400) process.exitCode = 1;
}

await indexNow();
await webSub();
