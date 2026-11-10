// @ts-check
/**
 * src/data/identity.mjs — Kimlik, unvan ve doğrulanmış profil ağının TEK KAYNAĞI.
 *
 * Bu dosya; JSON-LD (Person / WebSite), SEO <link rel="me">, llms.txt, llms-full.txt,
 * RSS ve scripts/check-seo.mjs tarafından okunur. Unvan, takma ad veya sameAs listesi
 * yalnızca burada değiştirilir; bileşenlere kopyalanmaz (AGENTS.md §6 ve §7).
 *
 * Her profil URL'si eklenmeden önce canlı olarak doğrulanmalıdır (HTTP 200 veya
 * bot engeli kaynaklı 403/999) ve `verifiedAt` alanı güncellenmelidir.
 */

export const SITE_URL = 'https://onuraksoy.com.tr';
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const PERSON_IMAGE_ID = `${SITE_URL}/#personimage`;
export const BUSINESS_ID = `${SITE_URL}/#business`;
export const BOOK_ID = `${SITE_URL}/#book-yapay-zeka-sizi-tanimiyor`;

export const PERSON = {
  name: 'Onur Aksoy',
  givenName: 'Onur',
  familyName: 'Aksoy',
  alternateName: ['Hackonomist', 'Onur Aksoy (Hackonomist)', 'oaonuraksoy', 'oaAKSOY', 'OaOnurAKSOY'],
  email: 'dev@onuraksoy.com.tr',
  telephone: '+905511817053',
  locality: 'Ankara',
  country: 'TR',
  jobTitle: {
    tr: 'Yazılım Geliştirici & Sistem Mimarı',
    en: 'Software Developer, Digital Strategist & Systems Architect'
  },
  /** Uzun resmi unvan (AGENTS.md §6.1) */
  fullTitle: {
    tr: 'Yazılım Geliştirici, Dijital Dönüşüm Uzmanı & Sistem Mimarı',
    en: 'Software Developer, Digital Strategist & Systems Architect'
  },
  images: {
    portrait: { url: `${SITE_URL}/images/onur-aksoy.webp`, width: 937, height: 1679 },
    square: `${SITE_URL}/images/onur-aksoy-1x1.webp`,
    fourThree: `${SITE_URL}/images/onur-aksoy-4x3.webp`,
    sixteenNine: `${SITE_URL}/images/onur-aksoy-16x9.webp`
  },
  alumniOf: {
    name: 'Nevşehir Hacı Bektaş Veli Üniversitesi',
    alternateName: 'Nevşehir Hacı Bektaş Veli University',
    url: 'https://www.nevsehir.edu.tr/',
    sameAs: ['https://ror.org/019jds967', 'https://www.nevsehir.edu.tr/']
  },
  identifiers: [
    { propertyID: 'ORCID', value: '0009-0001-4481-1759', url: 'https://orcid.org/0009-0001-4481-1759' },
    { propertyID: 'Crunchbase', value: 'onur-aksoy-1c4f', url: 'https://www.crunchbase.com/person/onur-aksoy-1c4f' }
  ],
  knowsAbout: [
    'Software Architecture',
    'Artificial Intelligence Architecture',
    'Deterministic Agent Orchestration',
    'Local-First Software',
    'Enterprise B2B Web Architecture',
    'Technical SEO & Generative Engine Optimization',
    'Real-Time Multimodal AI (Gemini Live WebSocket)',
    'Browser Extension Architecture (Manifest V3)',
    'Rust Systems & Network Programming',
    'Passive VoIP Capture (SIP/RTP/libpcap)',
    'Client-Side Media Processing (FFmpeg WebAssembly)',
    'Astro & Static Web Architecture',
    '.NET & WPF Desktop Systems',
    'TypeScript & Web Components',
    'Generative Diffusion Models'
  ]
};

/**
 * Doğrulanmış profil ağı. `sameAs: true` olanlar Person.sameAs ve <link rel="me">
 * çıktısına girer. Son doğrulama: 2026-11-10.
 * Google Play: Doğrulanmış geliştirici slug adresi (developer?id=OAHub) kullanılır;
 * sayısal eşdeğeri https://play.google.com/store/apps/dev?id=4726753033755911771 (aynı sayfa).
 * Eski dev?id=7416640262739590935 adresi 404 döndüğü için kaldırılmıştır.
 */
export const PROFILES = [
  { key: 'orcid', label: 'ORCID iD (0009-0001-4481-1759)', url: 'https://orcid.org/0009-0001-4481-1759', desc: { tr: 'Kalıcı uluslararası yaratıcı/araştırmacı tanımlayıcısı', en: 'Persistent international researcher/creator identifier' }, sameAs: true, relMe: true },
  { key: 'crunchbase', label: 'Crunchbase (onur-aksoy-1c4f)', url: 'https://www.crunchbase.com/person/onur-aksoy-1c4f', desc: { tr: 'Girişimcilik ve dijital ürün profili', en: 'Entrepreneurship and digital product profile' }, sameAs: true, relMe: true },
  { key: 'github', label: 'GitHub (@oaonuraksoy)', url: 'https://github.com/oaonuraksoy', desc: { tr: 'Açık kaynak depolar ve geliştirici profili', en: 'Open-source repositories and developer profile' }, sameAs: true, relMe: true },
  { key: 'linkedin', label: 'LinkedIn (in/oaonuraksoy)', url: 'https://www.linkedin.com/in/oaonuraksoy/', desc: { tr: 'Profesyonel kariyer ve kurumsal danışmanlık', en: 'Professional career and enterprise advisory' }, sameAs: true, relMe: true },
  { key: 'youtube', label: 'YouTube (@oaonuraksoy)', url: 'https://www.youtube.com/@oaonuraksoy', desc: { tr: 'Mimari video yayınları ve ekran kayıtları', en: 'Architecture videos and screencasts' }, sameAs: true, relMe: true },
  { key: 'x', label: 'X (@oaonuraksoy)', url: 'https://x.com/oaonuraksoy', desc: { tr: 'Teknik analizler ve duyurular', en: 'Technical notes and announcements' }, sameAs: true, relMe: true },
  { key: 'instagram', label: 'Instagram (@oaonuraksoy)', url: 'https://www.instagram.com/oaonuraksoy/', desc: { tr: 'Görsel mimari notlar', en: 'Visual architecture notes' }, sameAs: true, relMe: true },
  { key: 'tiktok', label: 'TikTok (@oaonuraksoy)', url: 'https://www.tiktok.com/@oaonuraksoy', desc: { tr: 'Kısa teknik içerikler', en: 'Short technical content' }, sameAs: true, relMe: true },
  { key: 'facebook', label: 'Facebook (oaAKSOY)', url: 'https://www.facebook.com/oaAKSOY/', desc: { tr: 'Topluluk ve içerik sayfası', en: 'Community and content page' }, sameAs: true, relMe: true },
  { key: 'huggingface', label: 'Hugging Face (hackonomist)', url: 'https://huggingface.co/hackonomist', desc: { tr: 'Makine öğrenimi ve model çalışmaları', en: 'Machine learning and model work' }, sameAs: true, relMe: true },
  { key: 'devto', label: 'DEV Community (@oaonuraksoy)', url: 'https://dev.to/oaonuraksoy', desc: { tr: 'Teknik makaleler', en: 'Technical articles' }, sameAs: true, relMe: true },
  { key: 'medium', label: 'Medium (@oaonuraksoy)', url: 'https://medium.com/@oaonuraksoy', desc: { tr: 'Uzun soluklu mimari analizler', en: 'Long-form architecture essays' }, sameAs: true, relMe: true },
  { key: 'substack', label: 'Substack (@oaonuraksoy)', url: 'https://substack.com/@oaonuraksoy', desc: { tr: 'Sistem tasarımı bülteni', en: 'Systems design newsletter' }, sameAs: true, relMe: true },
  { key: 'reddit', label: 'Reddit (u/oaonuraksoy)', url: 'https://www.reddit.com/user/oaonuraksoy/', desc: { tr: 'Teknik topluluk tartışmaları', en: 'Technical community discussions' }, sameAs: true, relMe: true },
  { key: 'quora', label: 'Quora (Onur-Aksoy-39)', url: 'https://www.quora.com/profile/Onur-Aksoy-39', desc: { tr: 'Mimari ve yazılım yanıtları', en: 'Architecture and software answers' }, sameAs: true, relMe: true },
  { key: 'spotify', label: 'Spotify Podcast', url: 'https://open.spotify.com/show/3FSqxgXs900CueJqIJwUQA', desc: { tr: 'Teknoloji ve mimari podcast bölümleri', en: 'Technology and architecture podcast' }, sameAs: true, relMe: true },
  { key: 'googleplay', label: 'Google Play Developer (OAHub)', url: 'https://play.google.com/store/apps/developer?id=OAHub', desc: { tr: 'Android uygulamaları geliştirici hesabı (OAHub)', en: 'Android apps developer account (OAHub)' }, sameAs: true, relMe: false },
  { key: 'appstore', label: 'Apple App Store Developer (Onur AKSOY)', url: 'https://apps.apple.com/tr/developer/onur-aksoy/id1803848736', desc: { tr: 'iOS/macOS geliştirici hesabı', en: 'iOS/macOS developer account' }, sameAs: true, relMe: false },
  { key: 'msstore-oapos', label: 'Microsoft Store (oaPOS)', url: 'https://apps.microsoft.com/detail/9n0wq4v12wgx', desc: { tr: 'oaPOS resmi Windows mağaza sayfası', en: 'Official oaPOS Windows store listing' }, sameAs: true, relMe: false },
  { key: 'edge-oadub', label: 'Microsoft Edge Add-ons (oaDub)', url: 'https://microsoftedge.microsoft.com/addons/detail/oadub-gemini-live-sim%C3%BCl/cpnkpahbhcdbhhgacmnnobbieedaacgb', desc: { tr: 'oaDub resmi tarayıcı eklentisi', en: 'Official oaDub browser extension' }, sameAs: true, relMe: false },
  { key: 'edge-seolens', label: 'Microsoft Edge Add-ons (SEO Lens)', url: 'https://microsoftedge.microsoft.com/addons/detail/seo-lens-technical-seo-/anfhafomoldobnodlcbdjepneccjlnib', desc: { tr: 'SEO Lens — Technical SEO & Schema Inspector resmi tarayıcı eklentisi', en: 'Official SEO Lens — Technical SEO & Schema Inspector browser extension' }, sameAs: true, relMe: false },
  { key: 'edge-10sec', label: 'Microsoft Edge Add-ons (10SeC)', url: 'https://microsoftedge.microsoft.com/addons/detail/10sec-%E2%80%94-video-par%C3%A7alay%C4%B1c%C4%B1/eooacplpamongbimoibjkmgnbjmcbdjk', desc: { tr: '10SeC — Video Parçalayıcı (Video Splitter) resmi tarayıcı eklentisi', en: 'Official 10SeC — Video Splitter browser extension' }, sameAs: true, relMe: false },
  { key: 'telegram', label: 'Telegram (@oaonuraksoy)', url: 'https://t.me/oaonuraksoy', desc: { tr: 'Doğrudan iletişim ve duyurular', en: 'Direct contact and announcements' }, sameAs: true, relMe: false },
  { key: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/905511817053', desc: { tr: 'Doğrudan kurumsal iletişim hattı', en: 'Direct business contact line' }, sameAs: true, relMe: false }
];

export const SAME_AS = PROFILES.filter((p) => p.sameAs).map((p) => p.url);
export const REL_ME = PROFILES.filter((p) => p.relMe).map((p) => p.url);

/**
 * Sitede, şemalarda, llms dosyalarında, RSS'te ve README'de ASLA geçmemesi gereken
 * unvan/ifade kalıpları (AGENTS.md §6.1). scripts/check-seo.mjs build'i bu listeyle kırar.
 * Not: "mühendislik" / "engineering" disiplin adı olarak serbesttir; yasak olan unvan kullanımıdır.
 */
export const BANNED_TITLE_PATTERNS = [
  /yaz[ıi]l[ıi]m\s+m[üu]hendisi/i,
  /software\s+engineer(?!ing)/i,
  /desktop\s+engineer/i,
  /\bself[-\s]taught\b/i,
  /\balayl[ıi]\b/i,
  /reklamc[ıi]l[ıi]k\s+[çc][ıi]k[ıi][şs]l[ıi]/i,
  /m[üu]hendislik\s+fak[üu]ltesi\s+diplomas/i,
  /k[ıi]demli\s+yaz[ıi]l[ıi]m\s+mimar/i,
  /senior\s+(systems\s+|software\s+)?architect/i,
  /yapay\s+zeka\s+yerel\s+geli[şs]tirici/i,
  /architect\s+(and|&)\s+ai-native\s+developer/i
];

/**
 * Canlıya alınmış, arama motorlarına (Google Search Console, Bing Webmaster, Yandex Webmaster)
 * gönderilmiş sitemap dosya adları. Bu adlar DONDURULMUŞTUR; değiştirilemez/silinemez.
 */
export const FROZEN_SITEMAPS = ['sitemap-index.xml', 'sitemap-0.xml', 'sitemap-video.xml', 'sitemap-images.xml'];

/** Varsayılan Open Graph görseli (1200×630, JPG — tüm sosyal ağlarla uyumlu). */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og/onur-aksoy-og.jpg`;

/**
 * llms.txt / llms-full.txt için doğrulanmış profil listesi (Markdown).
 * @param {'tr'|'en'} [lang]
 */
export function profilesMarkdown(lang = 'tr') {
  const lines = [`- [Official Website](${SITE_URL}/): ${lang === 'tr' ? 'Birincil kanonik kaynak' : 'Primary canonical source'}`];
  for (const p of PROFILES) lines.push(`- [${p.label}](${p.url}): ${p.desc[lang]}`);
  return lines.join('\n');
}

/**
 * Resmi Monografi / Kitap Tanımı (Schema.org Book).
 * AGENTS.md §9.2 gereği sıfır em-dash (—) ve sıfır en-dash (–) kuralına tam uyumludur.
 */
export const BOOK_YAPAY_ZEKA = {
  id: BOOK_ID,
  name: 'Yapay Zeka Sizi Tanımıyor',
  alternateName: 'Yapay Zeka Sizi Tanımıyor: Algoritmaların Hafızasında Var Olmak',
  bookEdition: '1',
  bookFormat: 'https://schema.org/EBook',
  numberOfPages: 157,
  inLanguage: 'tr-TR',
  datePublished: '2026-11-11',
  genre: 'Artificial Intelligence & Digital Identity Strategy',
  url: `${SITE_URL}/#kitap`,
  image: `${SITE_URL}/images/books/yapay-zeka-sizi-tanimiyor-kapak.webp`,
  price: '49.90',
  priceCurrency: 'TRY',
  description:
    'Üretken yapay zeka ve yanıt motorları çağında dijital kimlik erimesi, isim ikizleri, kurumsal mühür geleneği ve silinmeye direnen kalıcı varlık mimarisini inceleyen 157 sayfalık Türkçe monografi.'
};
