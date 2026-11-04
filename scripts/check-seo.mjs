/**
 * scripts/check-seo.mjs — SEO / GEO / kimlik koruma kapısı (build'in parçası; AGENTS.md §5, §6, §7).
 *
 * Herhangi bir kural ihlalinde build'i KIRAR (exit 1). Kurallar:
 *  K1  Yasaklı unvan/ifadeler dist/ çıktısında ve README.md'de geçemez.
 *  K2  Her sayfada tam olarak 1 adet JSON-LD bloğu; JSON geçerli; yinelenen @id yok.
 *  K3  Person.sameAs / jobTitle, src/data/identity.mjs ile birebir aynı.
 *  K4  <title> ≤ 60 karakter (yalnızca resmi unvanlı ana sayfa başlığı istisna), açıklama 110–160.
 *  K5  og:image = 1200×630 JPG/PNG, dosya mevcut, beyan edilen boyut = gerçek boyut,
 *      og:image:secure_url ve twitter:image aynı URL.
 *  K6  canonical = sayfanın kendi URL'si; hreflang tr/en/x-default eksiksiz ve karşılıklı.
 *  K7  Sayfa başına tek <h1> ve tek <main>.
 *  K8  Dondurulmuş sitemap dosyaları mevcut; robots.txt bunları listeler; sitemap-0.xml ile
 *      dist/ HTML sayfaları birebir örtüşür.
 *  K9  Kaynak kodda build anı tarihi (new Date() → lastmod/dateModified/pubDate) üretilemez.
 */
import fs from 'node:fs';
import path from 'node:path';
import { BANNED_TITLE_PATTERNS, SAME_AS, PERSON, FROZEN_SITEMAPS, SITE_URL } from '../src/data/identity.mjs';
import { imageMeta } from '../src/utils/image-meta.mjs';

const DIST = path.resolve('dist');
const errors = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);

function walk(dir, exts, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, exts, out);
    else if (exts.some((e) => f.endsWith(e))) out.push(p);
  }
  return out;
}
const rel = (p) => path.relative(process.cwd(), p).split(path.sep).join('/');
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attr = (html, re) => { const m = html.match(re); return m ? decode(m[1]) : null; };

// ── K1: yasaklı unvanlar ────────────────────────────────────────────────────
for (const file of [...walk(DIST, ['.html', '.txt', '.xml']), path.resolve('README.md')]) {
  const text = fs.readFileSync(file, 'utf8');
  for (const re of BANNED_TITLE_PATTERNS) {
    const m = text.match(re);
    if (m) fail(rel(file), `K1 yasaklı ifade: "${m[0]}"`);
  }
}

// ── Sayfa denetimleri ───────────────────────────────────────────────────────
const htmlFiles = walk(DIST, ['.html']).filter((f) => !f.endsWith('404.html'));
const pages = new Map();
const officialHomeTitles = [`Onur Aksoy — ${PERSON.jobTitle.tr}`, `Onur Aksoy — ${PERSON.fullTitle.en}`];
const sameAsKey = JSON.stringify([...SAME_AS].sort());

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const url = `${SITE_URL}/${path.relative(DIST, file).split(path.sep).join('/').replace(/index\.html$/, '')}`;
  const r = rel(file);

  // K2 / K3
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (blocks.length !== 1) fail(r, `K2 ${blocks.length} adet JSON-LD bloğu (1 olmalı)`);
  for (const b of blocks) {
    let data;
    try { data = JSON.parse(b); } catch { fail(r, 'K2 JSON-LD ayrıştırılamadı'); continue; }
    const graph = data['@graph'] || [data];
    const seen = new Set();
    for (const n of graph) {
      if (!n['@id']) continue;
      if (seen.has(n['@id'])) fail(r, `K2 yinelenen @id ${n['@id']}`);
      seen.add(n['@id']);
    }
    const person = graph.find((n) => n['@type'] === 'Person');
    if (!person) fail(r, 'K3 Person düğümü yok');
    else {
      if (JSON.stringify([...(person.sameAs || [])].sort()) !== sameAsKey) fail(r, 'K3 Person.sameAs identity.mjs ile uyuşmuyor');
      if (![PERSON.jobTitle.tr, PERSON.jobTitle.en].includes(person.jobTitle)) fail(r, `K3 resmi olmayan jobTitle: ${person.jobTitle}`);
    }
  }

  // K4
  const title = attr(html, /<title>([^<]*)<\/title>/);
  const desc = attr(html, /<meta name="description" content="([^"]*)"/);
  if (!title) fail(r, 'K4 <title> yok');
  else if ([...title].length > 60 && !officialHomeTitles.includes(title)) fail(r, `K4 <title> ${[...title].length} karakter (≤ 60): ${title}`);
  if (!desc) fail(r, 'K4 meta description yok');
  else if ([...desc].length < 110 || [...desc].length > 160) fail(r, `K4 açıklama ${[...desc].length} karakter (110–160)`);

  // K5
  const og = attr(html, /<meta property="og:image" content="([^"]*)"/);
  const ogSecure = attr(html, /<meta property="og:image:secure_url" content="([^"]*)"/);
  const ogW = attr(html, /<meta property="og:image:width" content="([^"]*)"/);
  const ogH = attr(html, /<meta property="og:image:height" content="([^"]*)"/);
  const tw = attr(html, /<meta name="twitter:image" content="([^"]*)"/);
  if (!og) fail(r, 'K5 og:image yok');
  else {
    if (!/\.(jpe?g|png)$/i.test(og)) fail(r, `K5 og:image JPG/PNG olmalı: ${og}`);
    if (ogSecure !== og) fail(r, 'K5 og:image:secure_url eksik veya farklı');
    if (tw !== og) fail(r, 'K5 twitter:image og:image ile aynı değil');
    const meta = imageMeta(og);
    if (meta.local && !meta.exists) fail(r, `K5 og:image dosyası yok: ${og}`);
    if (meta.width && (String(meta.width) !== ogW || String(meta.height) !== ogH)) fail(r, `K5 beyan ${ogW}×${ogH} ≠ gerçek ${meta.width}×${meta.height}`);
    if (meta.local && (meta.width !== 1200 || meta.height !== 630)) fail(r, `K5 og:image 1200×630 değil (${meta.width}×${meta.height})`);
  }

  // K6
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  if (canonical !== url) fail(r, `K6 canonical ${canonical} ≠ ${url}`);
  const hl = {};
  for (const m of html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)) hl[m[1]] = m[2];
  if (!hl.tr || !hl.en || !hl['x-default']) fail(r, 'K6 hreflang tr/en/x-default eksik');
  if (hl['x-default'] && hl['x-default'] !== hl.tr) fail(r, 'K6 x-default Türkçe sürümü göstermeli');

  // K7
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  const main = (html.match(/<main[\s>]/g) || []).length;
  if (h1 !== 1) fail(r, `K7 ${h1} adet <h1>`);
  if (main !== 1) fail(r, `K7 ${main} adet <main>`);

  pages.set(url, hl);
}

// K6 karşılıklılık
for (const [url, hl] of pages) {
  for (const lang of ['tr', 'en']) {
    const target = hl[lang];
    if (!target || target === url) continue;
    const back = pages.get(target);
    if (!back) fail(url, `K6 hreflang ${lang} hedefi yok: ${target}`);
    else if (!Object.values(back).includes(url)) fail(url, `K6 hreflang ${lang} karşılıklı değil: ${target}`);
  }
}

// ── K8: site haritaları ─────────────────────────────────────────────────────
for (const s of FROZEN_SITEMAPS) if (!fs.existsSync(path.join(DIST, s))) fail('dist', `K8 dondurulmuş site haritası eksik: ${s}`);
const robots = fs.existsSync(path.join(DIST, 'robots.txt')) ? fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8') : '';
for (const s of ['sitemap-index.xml', 'sitemap-video.xml', 'sitemap-images.xml']) {
  if (!robots.includes(`Sitemap: ${SITE_URL}/${s}`)) fail('robots.txt', `K8 Sitemap satırı eksik: ${s}`);
}
const indexXml = fs.existsSync(path.join(DIST, 'sitemap-index.xml')) ? fs.readFileSync(path.join(DIST, 'sitemap-index.xml'), 'utf8') : '';
for (const s of ['sitemap-0.xml', 'sitemap-video.xml', 'sitemap-images.xml']) {
  if (!indexXml.includes(`${SITE_URL}/${s}`)) fail('sitemap-index.xml', `K8 ${s} listelenmemiş`);
}
if (fs.existsSync(path.join(DIST, 'sitemap-0.xml'))) {
  const locs = new Set([...fs.readFileSync(path.join(DIST, 'sitemap-0.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  for (const url of pages.keys()) if (!locs.has(url)) fail('sitemap-0.xml', `K8 sayfa site haritasında yok: ${url}`);
  for (const loc of locs) if (!pages.has(loc)) fail('sitemap-0.xml', `K8 haritadaki URL'nin sayfası yok: ${loc}`);
}

// ── K9: build anı tarihleri ─────────────────────────────────────────────────
for (const file of walk(path.resolve('src'), ['.astro', '.ts', '.mjs', '.js'])) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
    if (/new Date\(\s*\)(?!\.getFullYear\(\))/.test(line)) fail(`${rel(file)}:${i + 1}`, 'K9 build anı tarihi (new Date()) kullanılamaz');
  });
}

// ── Rapor ───────────────────────────────────────────────────────────────────
if (errors.length) {
  console.error(`\n❌ SEO/GEO koruma kapısı: ${errors.length} ihlal\n`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`\n🛡  SEO/GEO koruma kapısı: ${htmlFiles.length} sayfa, K1–K9 kuralları ✅ ihlal yok.`);
