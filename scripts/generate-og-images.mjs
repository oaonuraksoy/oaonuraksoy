/**
 * scripts/generate-og-images.mjs — Open Graph / Twitter kart görsellerini üretir.
 *
 * Çıktı: public/images/og/**.jpg — hepsi tam 1200×630 px, progressive JPEG.
 *   - og/onur-aksoy-og.jpg            ← public/images/onur-aksoy-og.webp (varsayılan görsel)
 *   - og/broadcasts/<slug>.jpg        ← public/images/broadcasts/<slug>.webp (kapaklar)
 *   - og/services/<slug>.jpg          ← public/images/services/<slug>.webp
 *   - og/projects/<slug>-<tr|en>.jpg  ← src/content/projects/<slug>.json (marka kartı)
 *
 * Neden JPG? WebP og:image bazı platformlarda (LinkedIn, bazı mesajlaşma önizlemeleri)
 * güvenilir biçimde gösterilmez. Sayfa içi görseller WebP kalır; yalnızca paylaşım kartları JPG'dir.
 *
 * Kullanım: npm run og:images            (yalnızca eksik/eskimiş görselleri üretir)
 *           npm run og:images -- --force (tümünü yeniden üretir)
 * Üretilen dosyalar commit edilir; CI'da çalıştırılmaz.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public/images/og');
const FORCE = process.argv.includes('--force');
const W = 1200;
const H = 630;

const isStale = (src, out) => FORCE || !fs.existsSync(out) || fs.statSync(src).mtimeMs > fs.statSync(out).mtimeMs;
const ensureDir = (p) => fs.mkdirSync(path.dirname(p), { recursive: true });
const toJpeg = (img) => img.jpeg({ quality: 82, progressive: true, mozjpeg: true });

let produced = 0;

async function convert(src, out) {
  if (!isStale(src, out)) return;
  ensureDir(out);
  await toJpeg(sharp(src).resize(W, H, { fit: 'cover', position: 'centre' }).flatten({ background: '#08090A' })).toFile(out);
  produced++;
  console.log(`  ✓ ${path.relative(ROOT, out)}`);
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function wrap(text, max) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = (line + ' ' + w).trim();
    }
  }
  if (line) lines.push(line);
  if (lines.length > 3) {
    lines.length = 3;
    lines[2] = lines[2].replace(/[\s,;:—-]*\S*$/, '') + '…';
  }
  return lines;
}

function projectCardSvg({ name, subtitle, label, accent, tags }) {
  const nameSize = name.length > 16 ? 76 : 96;
  const sub = wrap(subtitle, 44);
  const tagText = tags.slice(0, 4).join('  ·  ');
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="85%" cy="0%" r="75%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#08090A" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bar" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stop-color="#C58A3A"/>
      <stop offset="100%" stop-color="#F0C878"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#08090A"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect x="40" y="40" width="${W - 80}" height="${H - 80}" rx="18" fill="none" stroke="#1B1E24" stroke-width="2"/>
  <rect x="80" y="96" width="72" height="6" rx="3" fill="url(#bar)"/>
  <text x="80" y="150" font-family="Consolas, 'DejaVu Sans Mono', monospace" font-size="22" letter-spacing="4" fill="#C58A3A">${esc(label)}</text>
  <text x="80" y="${150 + nameSize + 18}" font-family="'Segoe UI', Arial, 'DejaVu Sans', sans-serif" font-weight="800" font-size="${nameSize}" fill="#EDEDED">${esc(name)}</text>
  ${sub.map((l, i) => `<text x="80" y="${150 + nameSize + 80 + i * 44}" font-family="'Segoe UI', Arial, 'DejaVu Sans', sans-serif" font-size="34" fill="#9DA3AE">${esc(l)}</text>`).join('\n  ')}
  <text x="80" y="${H - 84}" font-family="Consolas, 'DejaVu Sans Mono', monospace" font-size="20" fill="#9CA3AF">${esc(tagText)}</text>
  <text x="${W - 80}" y="108" text-anchor="end" font-family="'Segoe UI', Arial, 'DejaVu Sans', sans-serif" font-weight="700" font-size="24" fill="#F0C878">Onur Aksoy · onuraksoy.com.tr</text>
</svg>`;
}

async function projectCards() {
  const dir = path.join(ROOT, 'src/content/projects');
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const src = path.join(dir, file);
    const data = JSON.parse(fs.readFileSync(src, 'utf8'));
    for (const lang of ['tr', 'en']) {
      const out = path.join(OUT, 'projects', `${data.slug}-${lang}.jpg`);
      if (!isStale(src, out)) continue;
      const loc = data[lang];
      const [name, ...rest] = loc.title.split(/\s+—\s+/);
      const subtitle = rest.join(' — ') || loc.description;
      const svg = projectCardSvg({
        name,
        subtitle,
        label: lang === 'tr' ? 'MİMARİ VAKA ANALİZİ' : 'ARCHITECTURE CASE STUDY',
        accent: /^#[0-9a-f]{6}$/i.test(data.accentColor || '') ? data.accentColor : '#C58A3A',
        tags: data.tags || []
      });
      ensureDir(out);
      await toJpeg(sharp(Buffer.from(svg))).toFile(out);
      produced++;
      console.log(`  ✓ ${path.relative(ROOT, out)}`);
    }
  }
}

async function main() {
  console.log('🖼  Open Graph görselleri üretiliyor (1200×630 JPG)…');
  await convert(path.join(ROOT, 'public/images/onur-aksoy-og.webp'), path.join(OUT, 'onur-aksoy-og.jpg'));
  for (const sub of ['broadcasts', 'services']) {
    const dir = path.join(ROOT, 'public/images', sub);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.webp'))) {
      await convert(path.join(dir, f), path.join(OUT, sub, f.replace(/\.webp$/, '.jpg')));
    }
  }
  await projectCards();
  console.log(produced ? `✅ ${produced} görsel üretildi.` : '✅ Tüm OG görselleri güncel.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
