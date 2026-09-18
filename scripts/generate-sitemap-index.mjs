import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const sitemapIndexPath = path.join(distDir, 'sitemap-index.xml');

const lastmod = new Date().toISOString();

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="https://onuraksoy.com.tr/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://onuraksoy.com.tr/sitemap-0.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://onuraksoy.com.tr/sitemap-video.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://onuraksoy.com.tr/sitemap-images.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>
`;

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

fs.writeFileSync(sitemapIndexPath, xml.trim() + '\n', 'utf-8');
console.log('✅ Updated dist/sitemap-index.xml with all sitemaps (pages, video, images).');
