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
import { PERSON, PERSON_ID, WEBSITE_ID, PERSON_IMAGE_ID, SITE_URL, SAME_AS } from '../data/identity.mjs';
import { imageMeta } from './image-meta.mjs';

/** @param {'tr'|'en'} lang */
export const inLanguage = (lang) => (lang === 'tr' ? 'tr-TR' : 'en-US');

/** @param {'tr'|'en'} lang */
export function personNode(lang) {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: PERSON.name,
    givenName: PERSON.givenName,
    familyName: PERSON.familyName,
    alternateName: PERSON.alternateName,
    jobTitle: PERSON.jobTitle[lang],
    description:
      lang === 'tr'
        ? `Ankara merkezli ${PERSON.fullTitle.tr} (a.k.a. Hackonomist). oaPOS, oaDub, SEO Lens, 10SeC, Orvyna App Studio ve oa_sip_recorder sistemlerinin geliştiricisi.`
        : `Ankara-based ${PERSON.fullTitle.en} (a.k.a. Hackonomist). Builder of oaPOS, oaDub, SEO Lens, 10SeC, Orvyna App Studio and oa_sip_recorder.`,
    url: `${SITE_URL}/`,
    image: { '@id': PERSON_IMAGE_ID },
    email: `mailto:${PERSON.email}`,
    address: { '@type': 'PostalAddress', addressLocality: PERSON.locality, addressCountry: PERSON.country },
    nationality: { '@type': 'Country', name: 'Türkiye' },
    knowsLanguage: ['tr', 'en'],
    hasOccupation: {
      '@type': 'Occupation',
      name: PERSON.jobTitle[lang],
      occupationLocation: { '@type': 'City', name: PERSON.locality }
    },
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
