/**
 * scripts/generate-sitemap-index.mjs — dist/sitemap-index.xml dosyasını tüm site haritalarıyla yeniden yazar.
 *
 * DONDURULMUŞ DOSYA ADLARI (AGENTS.md §7.3): sitemap-index.xml, sitemap-0.xml, sitemap-video.xml,
 * sitemap-images.xml — Google Search Console, Bing ve Yandex Webmaster'a kayıtlıdır; değiştirilmez.
 *
 * <lastmod> değeri build anı DEĞİLDİR: her alt haritanın içindeki en güncel <lastmod> /
 * <video:publication_date> değeri kullanılır; hiçbiri yoksa sayfa haritasının en günceli alınır.
 */
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const SITE = 'https://onuraksoy.com.tr';
const SITEMAPS = ['sitemap-0.xml', 'sitemap-video.xml', 'sitemap-images.xml'];

function latestDate(file) {
  const p = path.join(distDir, file);
  if (!fs.existsSync(p)) throw new Error(`Eksik site haritası: dist/${file}`);
  const xml = fs.readFileSync(p, 'utf8');
  const dates = [...xml.matchAll(/<(?:lastmod|video:publication_date)>([^<]+)</g)].map((m) => Date.parse(m[1])).filter(Number.isFinite);
  return dates.length ? Math.max(...dates) : null;
}

const pagesLatest = latestDate('sitemap-0.xml');
const entries = SITEMAPS.map((file) => {
  const d = latestDate(file) ?? pagesLatest;
  return `  <sitemap>
    <loc>${SITE}/${file}</loc>${d ? `\n    <lastmod>${new Date(d).toISOString()}</lastmod>` : ''}
  </sitemap>`;
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</sitemapindex>
`;

fs.writeFileSync(path.join(distDir, 'sitemap-index.xml'), xml, 'utf-8');
console.log('✅ dist/sitemap-index.xml güncellendi (pages, video, images).');
