// @ts-check
/**
 * src/utils/schema.mjs — Schema.org @graph düğüm üreticileri (JsonLd.astro ve BroadcastJsonLd.astro ortak).
 *
 * Kurallar (AGENTS.md §7.1):
 *  - Her sayfada TEK bir <script type="application/ld+json"> ve TEK bir @graph bulunur.
 *  - Site geneli varlıklar (#person, #website, #personimage) her sayfada BİREBİR aynı içerikle üretilir;
 *    sayfaya özgü düğümlerin @id'si sayfa URL'sine bağlıdır (`${url}#webpage`, `${url}#primaryimage` …).
 *  - Aynı @id iki farklı içerikle tanımlanamaz.
 *  - Tarihler src/utils/content-dates.mjs'den gelir; build anı yazılmaz.
 */
import {
  PERSON,
  PERSON_ID,
  WEBSITE_ID,
  PERSON_IMAGE_ID,
  BUSINESS_ID,
  DEFAULT_OG_IMAGE,
  BOOK_YAPAY_ZEKA,
  SITE_URL,
  SAME_AS
} from '../data/identity.mjs';
import { imageMeta } from './image-meta.mjs';

/** @param {'tr'|'en'} lang */
export const inLanguage = (lang) => (lang === 'tr' ? 'tr-TR' : 'en-US');

/**
 * Person düğümü.
 * AGENTS.md §7.1 kuralı gereği tüm TR ve EN sayfalarda %100 birebir aynı
 * (byte-for-byte immutable) JSON nesnesi döndürür.
 * @param {'tr'|'en'} [_lang] Geriye dönük imza uyumluluğu için parametre korunur.
 */
export function personNode(_lang) {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: PERSON.name,
    givenName: PERSON.givenName,
    familyName: PERSON.familyName,
    alternateName: PERSON.alternateName,
    jobTitle: [PERSON.jobTitle.tr, PERSON.jobTitle.en],
    description:
      'Ankara-based Software Developer, Digital Strategist & Systems Architect (Yazılım Geliştirici, Dijital Dönüşüm Uzmanı & Sistem Mimarı; a.k.a. Hackonomist). Creator of oaPOS, oaDub, SEO Lens, 10SeC, Orvyna App Studio, and oa_sip_recorder.',
    disambiguatingDescription:
      'Ankara-based Software Developer, Digital Strategist & Systems Architect (moniker: Hackonomist; onuraksoy.com.tr). Creator of oaPOS, oaDub, SEO Lens, 10SeC, Orvyna App Studio, and oa_sip_recorder; author of Yapay Zeka Sizi Tanımıyor. Distinct from namesakes in yoga/mindfulness, clinical psychology, capital markets, or medicine.',
    url: `${SITE_URL}/`,
    image: [
      { '@id': PERSON_IMAGE_ID },
      PERSON.images.square,
      PERSON.images.fourThree,
      PERSON.images.sixteenNine
    ],
    email: `mailto:${PERSON.email}`,
    address: { '@type': 'PostalAddress', addressLocality: PERSON.locality, addressCountry: PERSON.country },
    nationality: { '@type': 'Country', name: 'Türkiye' },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: PERSON.alumniOf.name,
      alternateName: PERSON.alumniOf.alternateName,
      url: PERSON.alumniOf.url,
      sameAs: PERSON.alumniOf.sameAs
    },
    knowsLanguage: ['tr', 'en'],
    hasOccupation: [
      {
        '@type': 'Occupation',
        name: PERSON.jobTitle.tr,
        occupationLocation: { '@type': 'City', name: PERSON.locality }
      },
      {
        '@type': 'Occupation',
        name: PERSON.jobTitle.en,
        occupationLocation: { '@type': 'City', name: PERSON.locality }
      }
    ],
    identifier: PERSON.identifiers.map((i) => ({ '@type': 'PropertyValue', ...i })),
    knowsAbout: PERSON.knowsAbout,
    sameAs: SAME_AS
  };
}

export function personImageNode() {
  const p = PERSON.images.portrait;
  return {
    '@type': 'ImageObject',
    '@id': PERSON_IMAGE_ID,
    url: p.url,
    contentUrl: p.url,
    width: p.width,
    height: p.height,
    caption: PERSON.name,
    creditText: PERSON.name,
    creator: { '@id': PERSON_ID },
    copyrightNotice: `© ${PERSON.name}`
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: PERSON.name,
    alternateName: ['Hackonomist', 'onuraksoy.com.tr'],
    inLanguage: ['tr-TR', 'en-US'],
    publisher: { '@id': PERSON_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/broadcasts/?q={search_term_string}` },
      'query-input': 'required name=search_term_string'
    }
  };
}

/**
 * Sayfanın birincil görseli (gerçek boyutlarla).
 * @param {string} pageUrl @param {string} imageUrl @param {string} caption
 */
export function primaryImageNode(pageUrl, imageUrl, caption) {
  const m = imageMeta(imageUrl);
  return {
    '@type': 'ImageObject',
    '@id': `${pageUrl}#primaryimage`,
    url: m.url,
    contentUrl: m.url,
    ...(m.width ? { width: m.width, height: m.height } : {}),
    ...(m.type ? { encodingFormat: m.type } : {}),
    caption
  };
}

/**
 * @param {string} pageUrl
 * @param {{name: string, url: string}[]} items Ana sayfa dahil sıralı kırıntılar
 */
export function breadcrumbNode(pageUrl, items) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url }))
  };
}

/** @param {string} pageUrl @param {{question: string, answer: string}[]} faqs */
export function faqNode(pageUrl, faqs) {
  return {
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    isPartOf: { '@id': `${pageUrl}#webpage` },
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer }
    }))
  };
}

/** @param {Record<string, any>[]} graph */
export function graphJson(graph) {
  const ids = new Map();
  for (const n of graph) {
    if (!n['@id']) continue;
    if (ids.has(n['@id'])) throw new Error(`[schema] Yinelenen @id: ${n['@id']}`);
    ids.set(n['@id'], true);
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

/**
 * Kurumsal B2B Hizmet Alanları (6 Bölge — docs/API.md §1.6 ile uyumlu tipli nesneler).
 */
export const SERVICE_AREA_SERVED = [
  { '@type': 'City', name: 'Ankara' },
  { '@type': 'Place', name: 'OSTİM Organize Sanayi Bölgesi' },
  { '@type': 'Place', name: 'İvedik Organize Sanayi Bölgesi' },
  { '@type': 'Place', name: 'Başkent Organize Sanayi Bölgesi' },
  { '@type': 'Place', name: 'Ankara Sanayi Odası 1. ve 2. Organize Sanayi Bölgesi (Sincan)' },
  { '@type': 'Country', name: 'Türkiye' }
];

/**
 * Kurumsal B2B ProfessionalService Düğümü (#business).
 * AGENTS.md §7.1 gereği tüm B2B sayfalarında %100 birebir aynı JSON nesnesi üretilir.
 * K10 kuralı gereği kişisel sameAs listesi LocalBusiness/ProfessionalService ile ASLA karıştırılmaz.
 */
export function businessNode() {
  return {
    '@type': 'ProfessionalService',
    '@id': BUSINESS_ID,
    name: 'Onur Aksoy (Hackonomist)',
    description:
      'Ankara-based enterprise B2B web design, custom software architecture, ERP/API integration, and deterministic AI (MCP) automation practice led by Onur Aksoy.',
    url: `${SITE_URL}/`,
    image: DEFAULT_OG_IMAGE,
    founder: { '@id': PERSON_ID },
    email: PERSON.email,
    telephone: PERSON.telephone,
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: PERSON.locality,
      addressCountry: PERSON.country
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 39.9334,
      longitude: 32.8597
    },
    areaServed: SERVICE_AREA_SERVED
  };
}

/**
 * B2B Hizmet Teklif Kataloğu Üreticisi (OfferCatalog).
 * Kanibalizmi önlemek için web-design ve custom-software için sıfır kesişimli,
 * bağımsız 4'er teklif içeren yapılandırılmış katalog döndürür.
 * @param {'web-design'|'custom-software'} kind
 * @param {'tr'|'en'} lang
 */
export function serviceOfferCatalog(kind, lang) {
  if (kind === 'web-design') {
    const offersData = [
      {
        name:
          lang === 'tr'
            ? 'Sub-50ms Astro Zero-JS Kurumsal Web Tasarım'
            : 'Sub-50ms Astro Zero-JS Corporate Web Design',
        description:
          lang === 'tr'
            ? 'Küresel alıcılar için 50ms altı edge hızında derlenen, bağımsız HTML ve sıfır eklenti yüküyle çalışan kurumsal web tasarımı.'
            : 'Edge-rendered sub-50ms corporate web portals built with zero-JS runtime discipline for international enterprise buyers.'
      },
      {
        name:
          lang === 'tr'
            ? 'Çok Dilli B2B İhracat Portalı & Statik Hreflang Mimarisi'
            : 'Multilingual B2B Export Portals & Static Hreflang Architecture',
        description:
          lang === 'tr'
            ? 'Uluslararası aramalarda kanibalizmi önleyen çift yönlü statik hreflang ve çok dilli B2B ihracat mimarisi.'
            : 'Bidirectional static hreflang architecture eliminating SERP cannibalization across multi-country export portals.'
      },
      {
        name:
          lang === 'tr'
            ? 'OSB Sanayi Ürün Katalogları (GTIP/CAD) & Kurumsal RFQ Altyapısı'
            : 'Industrial Product Catalogs (HS-Code/CAD) & Corporate RFQ Pipelines',
        description:
          lang === 'tr'
            ? 'GTIP/HS kodlu yapılandırılmış ürün şemaları, 3D STEP/CAD indirme ve güvenli teklif (RFQ) veri sözleşmeleri.'
            : 'Structured HS-code catalogs, 3D CAD distribution pipelines, and type-safe RFQ data contracts for procurement directors.'
      },
      {
        name:
          lang === 'tr'
            ? 'Teknik SEO, Tekil @graph Schema.org & GEO Görünürlük Mimarisi'
            : 'Technical SEO, Single-Graph Schema.org & GEO Visibility Architecture',
        description:
          lang === 'tr'
            ? 'Yapay zeka yanıt motorları (GEO) ve arama motorları için tekil @graph Schema.org ve semantik varlık doğrulaması.'
            : 'Single-graph Schema.org entity architecture and generative engine optimization (GEO) for enterprise visibility.'
      }
    ];

    return {
      '@type': 'OfferCatalog',
      name:
        lang === 'tr'
          ? 'Kurumsal Web Tasarım & B2B İhracat Mimarisi Hizmetleri'
          : 'Corporate Web Design & B2B Export Architecture Services',
      itemListElement: offersData.map((o) => ({
        '@type': 'Offer',
        name: o.name,
        description: o.description,
        itemOffered: {
          '@type': 'Service',
          name: o.name,
          description: o.description,
          provider: { '@id': BUSINESS_ID }
        }
      }))
    };
  }

  const softwareOffersData = [
    {
      name:
        lang === 'tr'
          ? 'Özel Web Yazılım & Yüksek Eşzamanlı İş Mantığı (TypeScript, Rust, .NET 8)'
          : 'Bespoke Web Software & High-Concurrency Business Logic (TypeScript, Rust, .NET 8)',
      description:
        lang === 'tr'
          ? 'Kritik kurumsal süreçler için TypeScript, Rust ve .NET 8 ile geliştirilen yüksek eşzamanlı web yazılımı ve mikroservisler.'
          : 'High-concurrency enterprise web backends and microservices engineered with TypeScript, Rust, and .NET 8.'
    },
    {
      name:
        lang === 'tr'
          ? 'Kurumsal ERP (SAP/Logo/Mikro), Stok & API Veri Köprüleri'
          : 'Enterprise ERP (SAP/Logo/Mikro), Inventory & API Data Bridges',
      description:
        lang === 'tr'
          ? 'SAP, Logo ve Mikro ERP sistemleriyle güvenli, çift yönlü ve işlemsel API veri entegrasyon hatları.'
          : 'Transactional bidirectional API bridges and inventory synchronization pipelines for SAP, Logo, and Mikro ERP.'
    },
    {
      name:
        lang === 'tr'
          ? 'Yerel Öncelikli (Local-First) LAN Soket & Masaüstü-Web Hibrit Sistemler'
          : 'Local-First LAN Socket & Desktop-Web Hybrid Systems',
      description:
        lang === 'tr'
          ? 'Bulut ve internet kesintilerinde bile kesintisiz çalışan yerel öncelikli (local-first) LAN durum makineleri ve masaüstü sistemleri.'
          : 'Offline-first LAN state replication engines and desktop-web hybrid systems resilient to cloud outages.'
    },
    {
      name:
        lang === 'tr'
          ? 'Deterministik Yapay Zeka Ajanları (MCP) & Süreç Otomasyonu'
          : 'Deterministic AI Agents (MCP) & Enterprise Workflow Automation',
      description:
        lang === 'tr'
          ? 'Halüsinasyonsuz, katı tipli sözleşmelerle Model Context Protocol (MCP) üzerinden işleyen otonom süreç otomasyonu.'
          : 'Deterministic Model Context Protocol (MCP) agent workflows and verifiable autonomous enterprise process automation.'
    }
  ];

  return {
    '@type': 'OfferCatalog',
    name:
      lang === 'tr'
        ? 'Özel Web Yazılım, ERP & Yapay Zeka Otomasyonu Hizmetleri'
        : 'Custom Web Software, ERP & AI Automation Services',
    itemListElement: softwareOffersData.map((o) => ({
      '@type': 'Offer',
      name: o.name,
      description: o.description,
      itemOffered: {
        '@type': 'Service',
        name: o.name,
        description: o.description,
        provider: { '@id': BUSINESS_ID }
      }
    }))
  };
}

/**
 * Resmi Kitap Düğümü (Schema.org Book).
 * / ve /en/ sayfalarında %100 birebir aynı JSON olarak üretilir.
 * Bekleyen/uydurma ISBN eklenmez; workExample formatları PDF ve EPUB olarak belirtilir.
 */
export function bookNode() {
  return {
    '@type': 'Book',
    '@id': BOOK_YAPAY_ZEKA.id,
    name: BOOK_YAPAY_ZEKA.name,
    alternateName: BOOK_YAPAY_ZEKA.alternateName,
    description: BOOK_YAPAY_ZEKA.description,
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    bookEdition: BOOK_YAPAY_ZEKA.bookEdition,
    bookFormat: BOOK_YAPAY_ZEKA.bookFormat,
    numberOfPages: BOOK_YAPAY_ZEKA.numberOfPages,
    inLanguage: BOOK_YAPAY_ZEKA.inLanguage,
    datePublished: BOOK_YAPAY_ZEKA.datePublished,
    genre: BOOK_YAPAY_ZEKA.genre,
    url: BOOK_YAPAY_ZEKA.url,
    image: BOOK_YAPAY_ZEKA.image,
    workExample: [
      {
        '@type': 'Book',
        '@id': `${BOOK_YAPAY_ZEKA.id}-pdf`,
        bookFormat: 'https://schema.org/EBook',
        encodingFormat: 'application/pdf',
        name: `${BOOK_YAPAY_ZEKA.name} (PDF E-Kitap)`,
        inLanguage: BOOK_YAPAY_ZEKA.inLanguage
      },
      {
        '@type': 'Book',
        '@id': `${BOOK_YAPAY_ZEKA.id}-epub`,
        bookFormat: 'https://schema.org/EBook',
        encodingFormat: 'application/epub+zip',
        name: `${BOOK_YAPAY_ZEKA.name} (EPUB E-Kitap)`,
        inLanguage: BOOK_YAPAY_ZEKA.inLanguage
      }
    ],
    offers: {
      '@type': 'Offer',
      price: '49.90',
      priceCurrency: 'TRY',
      availability: 'https://schema.org/InStock',
      url: BOOK_YAPAY_ZEKA.url,
      seller: { '@id': PERSON_ID }
    }
  };
}
