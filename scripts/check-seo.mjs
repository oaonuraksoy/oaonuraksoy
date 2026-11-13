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
 *  K10 Sayfalar arası @id değişmezliği & ProfessionalService sameAs yasağı.
 *  K11 Sayfa tipi ayrımı (ProfilePage, AboutPage, ContactPage, Book, FAQPage yasağı) & teklif kanibalizm engeli.
 *  K12 Akademik ScholarlyArticle & Yayın WebPage.about.
 *  K13 Kitap ISBN & Önizleme Bütünlüğü (K13a) ve Google Scholar Highwire Press citation_* / Öz-Arşiv PDF (K13b).
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  BANNED_TITLE_PATTERNS,
  SAME_AS,
  PERSON,
  FROZEN_SITEMAPS,
  SITE_URL,
  PERSON_IMAGE_ID,
  BOOK_ID,
  BOOK_YAPAY_ZEKA
} from '../src/data/identity.mjs';
import { imageMeta } from '../src/utils/image-meta.mjs';

const DIST = path.resolve('dist');
const errors = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);

const globalIdMap = new Map();
const profilePageUrls = [];
const offersWebDesign = [];
const offersCustomSoftware = [];
const offersAiAutomation = [];

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
const getMeta = (html, name) => {
  const m = html.match(new RegExp(`<meta\\s+[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i')) ||
            html.match(new RegExp(`<meta\\s+[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["']`, 'i'));
  return m ? decode(m[1]) : null;
};

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

  // K2 / K3 / K10 / K11 / K12
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

    // K3: Person düğümü kontrolleri
    const person = graph.find((n) => n['@type'] === 'Person');
    if (!person) fail(r, 'K3 Person düğümü yok');
    else {
      if (JSON.stringify([...(person.sameAs || [])].sort()) !== sameAsKey) fail(r, 'K3 Person.sameAs identity.mjs ile uyuşmuyor');
      if (Array.isArray(person.jobTitle)) {
        const sortedJobs = [...person.jobTitle].sort();
        const expectedJobs = [PERSON.jobTitle.tr, PERSON.jobTitle.en].sort();
        if (JSON.stringify(sortedJobs) !== JSON.stringify(expectedJobs)) {
          fail(r, `K3 person.jobTitle beklenen TR/EN unvanlarıyla eşleşmiyor: ${JSON.stringify(person.jobTitle)}`);
        }
      } else if (![PERSON.jobTitle.tr, PERSON.jobTitle.en].includes(person.jobTitle)) {
        fail(r, `K3 resmi olmayan jobTitle: ${person.jobTitle}`);
      }

      if (!person.alumniOf) {
        fail(r, 'K3 person.alumniOf eksik');
      } else {
        const ror = Array.isArray(person.alumniOf.sameAs) && person.alumniOf.sameAs.includes('https://ror.org/019jds967');
        if (!ror) fail(r, 'K3 person.alumniOf.sameAs içinde https://ror.org/019jds967 yok');
      }

      if (!Array.isArray(person.image) || person.image.length !== 4) {
        fail(r, `K3 person.image 4 elemanlı dizi olmalı (mevcut: ${Array.isArray(person.image) ? person.image.length : typeof person.image})`);
      } else {
        const hasPersonImageId = person.image.some((img) => img && typeof img === 'object' && img['@id'] === PERSON_IMAGE_ID);
        if (!hasPersonImageId) fail(r, 'K3 person.image içinde #personimage @id nesnesi yok');
      }
    }

    // K10: Sayfalar arası @id değişmezliği ve ProfessionalService sameAs yasağı
    function checkNodeImmutability(node) {
      if (!node || typeof node !== 'object') return;
      if (node['@id']) {
        const serialized = JSON.stringify(node);
        if (globalIdMap.has(node['@id'])) {
          const prev = globalIdMap.get(node['@id']);
          if (prev.serialized !== serialized) {
            fail(r, `K10 @id "${node['@id']}" sayfalar arasında tutarsız (ilk görülen: ${prev.file})`);
          }
        } else {
          globalIdMap.set(node['@id'], { serialized, file: r });
        }
      }
      if (Array.isArray(node.workExample)) {
        for (const we of node.workExample) checkNodeImmutability(we);
      }
    }

    for (const n of graph) {
      checkNodeImmutability(n);
      if (n['@type'] === 'ProfessionalService' || n['@id']?.endsWith('#business')) {
        if (n.sameAs) fail(r, 'K10 ProfessionalService kişisel sameAs içeremez');
      }
    }

    // K11: Sayfa tipi ayrımı & kanibalizm engeli (veri toplama ve sayfa denetimi)
    if (graph.some((n) => n['@type'] === 'ProfilePage')) {
      profilePageUrls.push(url);
    }

    if (url === `${SITE_URL}/about/` || url === `${SITE_URL}/en/about/`) {
      const aboutNode = graph.find((n) => n['@id'] === `${url}#webpage`);
      if (!aboutNode || aboutNode['@type'] !== 'AboutPage') {
        fail(r, `K11 about sayfasının @type değeri AboutPage olmalı (mevcut: ${aboutNode?.['@type']})`);
      }
      if (aboutNode && aboutNode.mainEntity) {
        fail(r, 'K11 AboutPage mainEntity içermemeli');
      }
    }

    const noFaqUrls = [`${SITE_URL}/`, `${SITE_URL}/en/`, `${SITE_URL}/about/`, `${SITE_URL}/en/about/`];
    if (noFaqUrls.includes(url) && graph.some((n) => n['@type'] === 'FAQPage')) {
      fail(r, `K11 ${url} sayfasında FAQPage düğümü bulunmamalı`);
    }

    if (url === `${SITE_URL}/` || url === `${SITE_URL}/en/`) {
      const bookNode = graph.find((n) => n['@type'] === 'Book' && n['@id'] === BOOK_ID);
      if (!bookNode) {
        fail(r, `K11 ${url} sayfasında Book düğümü (#book-yapay-zeka-sizi-tanimiyor) bulunmalı`);
      } else {
        // K13a: Kitap ISBN & Önizleme Bütünlüğü
        if (bookNode.isbn !== '9786250050002') {
          fail(r, `K13a Book.isbn değeri 9786250050002 olmalı (mevcut: ${bookNode.isbn})`);
        }
        if (bookNode.numberOfPages !== 158) {
          fail(r, `K13a Book.numberOfPages değeri 158 olmalı (mevcut: ${bookNode.numberOfPages})`);
        }
        const workExamples = Array.isArray(bookNode.workExample) ? bookNode.workExample : [];
        const pdfWork = workExamples.find((w) => w['@id'] === `${BOOK_ID}-pdf`);
        const epubWork = workExamples.find((w) => w['@id'] === `${BOOK_ID}-epub`);
        if (!pdfWork || pdfWork.isbn !== '9786250049976' || pdfWork.numberOfPages !== 158) {
          fail(r, `K13a Book.workExample PDF sürümünde isbn: 9786250049976 ve numberOfPages: 158 olmalı (mevcut: ${pdfWork?.isbn}, ${pdfWork?.numberOfPages})`);
        }
        if (!epubWork || epubWork.isbn !== '9786250050002') {
          fail(r, `K13a Book.workExample EPUB sürümünde isbn: 9786250050002 olmalı (mevcut: ${epubWork?.isbn})`);
        }
        const previewPdfPath = path.resolve(DIST, 'books/yapay-zeka-sizi-tanimiyor-ucretsiz-onizleme.pdf');
        if (!fs.existsSync(previewPdfPath)) {
          fail(r, 'K13a dist/books/yapay-zeka-sizi-tanimiyor-ucretsiz-onizleme.pdf mevcut değil');
        } else {
          const header = Buffer.alloc(5);
          const fd = fs.openSync(previewPdfPath, 'r');
          fs.readSync(fd, header, 0, 5, 0);
          fs.closeSync(fd);
          if (header.toString('utf8') !== '%PDF-') {
            fail(r, 'K13a dist/books/yapay-zeka-sizi-tanimiyor-ucretsiz-onizleme.pdf geçerli bir PDF dosyası değil (%PDF- ile başlamıyor)');
          }
        }
      }
    }

    if (url === `${SITE_URL}/contact/` || url === `${SITE_URL}/en/contact/`) {
      const contactNode = graph.find((n) => n['@id'] === `${url}#webpage`);
      if (!contactNode || contactNode['@type'] !== 'ContactPage') {
        fail(r, `K11 contact sayfasının @type değeri ContactPage olmalı (mevcut: ${contactNode?.['@type']})`);
      }
    }

    const serviceNode = graph.find((n) => n['@type'] === 'Service' || n['@id']?.endsWith('#service'));
    if (serviceNode && serviceNode.hasOfferCatalog?.itemListElement) {
      const offerNames = serviceNode.hasOfferCatalog.itemListElement.map((o) => o.name);
      if (url.includes('web-tasarim') || url.includes('b2b-web-architecture')) {
        offersWebDesign.push(...offerNames);
      } else if (url.includes('yapay-zeka') || url.includes('enterprise-ai')) {
        offersAiAutomation.push(...offerNames);
      } else if (url.includes('web-yazilim') || url.includes('custom-software')) {
        offersCustomSoftware.push(...offerNames);
      }
    }

    // K12: Akademik ScholarlyArticle & Yayın WebPage.about
    const articleNode = graph.find((n) => n['@id'] === `${url}#article`);
    if (articleNode) {
      const wpNode = graph.find((n) => n['@id'] === `${url}#webpage`);
      if (wpNode?.about?.['@id'] !== `${url}#article`) {
        fail(r, `K12 webpage.about @id değeri ${url}#article olmalı (mevcut: ${wpNode?.about?.['@id']})`);
      }

      const hasDoi =
        articleNode.identifier?.propertyID === 'DOI' ||
        (Array.isArray(articleNode.identifier) && articleNode.identifier.some((id) => id?.propertyID === 'DOI'));

      if (hasDoi) {
        const types = Array.isArray(articleNode['@type']) ? articleNode['@type'] : [articleNode['@type']];
        if (!types.includes('TechArticle') || !types.includes('ScholarlyArticle')) {
          fail(r, `K12 DOI içeren yayında @type hem TechArticle hem ScholarlyArticle içermeli (mevcut: ${JSON.stringify(articleNode['@type'])})`);
        }

        // K13b: Google Scholar Highwire Press citation_* & Öz-Arşiv PDF Bütünlüğü
        if (url.startsWith(`${SITE_URL}/en/broadcasts/`)) {
          const citTitle = getMeta(html, 'citation_title');
          const citAuthor = getMeta(html, 'citation_author');
          const citDate = getMeta(html, 'citation_publication_date');
          const citDoi = getMeta(html, 'citation_doi');
          const citPdfUrl = getMeta(html, 'citation_pdf_url');

          if (!citTitle) fail(r, 'K13b citation_title meta etiketi bulunamadı');
          if (citAuthor !== 'Aksoy, Onur') fail(r, `K13b citation_author "Aksoy, Onur" olmalı (mevcut: ${citAuthor})`);
          if (!citDate || !/^\d{4}\/\d{2}\/\d{2}$/.test(citDate)) fail(r, `K13b citation_publication_date YYYY/MM/DD formatında olmalı (mevcut: ${citDate})`);
          if (!citDoi) fail(r, 'K13b citation_doi meta etiketi bulunamadı');
          if (!citPdfUrl || !/^https:\/\/onuraksoy\.com\.tr\/papers\/.+\.pdf$/.test(citPdfUrl)) {
            fail(r, `K13b citation_pdf_url https://onuraksoy.com.tr/papers/*.pdf formatında olmalı (mevcut: ${citPdfUrl})`);
          } else {
            const paperFileName = citPdfUrl.replace('https://onuraksoy.com.tr/papers/', '');
            const paperDistPath = path.resolve(DIST, 'papers', paperFileName);
            if (!fs.existsSync(paperDistPath)) {
              fail(r, `K13b dist/papers/${paperFileName} mevcut değil`);
            } else {
              const header = Buffer.alloc(5);
              const fd = fs.openSync(paperDistPath, 'r');
              fs.readSync(fd, header, 0, 5, 0);
              fs.closeSync(fd);
              if (header.toString('utf8') !== '%PDF-') {
                fail(r, `K13b dist/papers/${paperFileName} geçerli bir PDF değil (%PDF- ile başlamıyor)`);
              }
            }
          }
        } else if (url.startsWith(`${SITE_URL}/broadcasts/`)) {
          const citPdfUrl = getMeta(html, 'citation_pdf_url');
          if (citPdfUrl) {
            fail(r, `K13b Türkçe yayında citation_pdf_url meta etiketi bulunmamalı (mevcut: ${citPdfUrl})`);
          }
        }
      }
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

// ── K11: Sayfa tipi ayrımı & kanibalizm engeli (global kontroller) ────────────
const expectedProfileUrls = [`${SITE_URL}/`, `${SITE_URL}/en/`].sort();
if (JSON.stringify([...profilePageUrls].sort()) !== JSON.stringify(expectedProfileUrls)) {
  fail('dist', `K11 ProfilePage sayfaları tam olarak [${expectedProfileUrls.join(', ')}] olmalı (bulunan: [${profilePageUrls.join(', ')}])`);
}

const intersectionWD_CS = offersWebDesign.filter((name) => offersCustomSoftware.includes(name));
const intersectionWD_AI = offersWebDesign.filter((name) => offersAiAutomation.includes(name));
const intersectionCS_AI = offersCustomSoftware.filter((name) => offersAiAutomation.includes(name));

if (intersectionWD_CS.length > 0) {
  fail('dist', `K11 Web Tasarım ve Özel Yazılım servis teklif adlarında kesişim var: ${intersectionWD_CS.join(', ')}`);
}
if (intersectionWD_AI.length > 0) {
  fail('dist', `K11 Web Tasarım ve Yapay Zeka Otomasyonu servis teklif adlarında kesişim var: ${intersectionWD_AI.join(', ')}`);
}
if (intersectionCS_AI.length > 0) {
  fail('dist', `K11 Özel Yazılım ve Yapay Zeka Otomasyonu servis teklif adlarında kesişim var: ${intersectionCS_AI.join(', ')}`);
}

const hasAiPages = htmlFiles.some((f) => f.includes('yapay-zeka') || f.includes('enterprise-ai'));
if (hasAiPages && offersAiAutomation.length === 0) {
  fail('dist', 'K11 Yapay Zeka Otomasyonu servis teklif kataloğu boş');
}
if (offersWebDesign.length === 0) {
  fail('dist', 'K11 Web Tasarım servis teklif kataloğu boş');
}
if (offersCustomSoftware.length === 0) {
  fail('dist', 'K11 Özel Yazılım servis teklif kataloğu boş');
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
console.log(`\n🛡  SEO/GEO koruma kapısı: ${htmlFiles.length} sayfa, K1–K13 kuralları ✅ ihlal yok.`);
