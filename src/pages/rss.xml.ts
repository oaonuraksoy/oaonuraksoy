import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getAllProjects } from '../utils/projects';
import { firstPublished, lastModified } from '../utils/content-dates.mjs';
import { SITE_URL, PERSON } from '../data/identity.mjs';

/**
 * /rss.xml — WebSub (PubSubHubbub) destekli içerik akışı (AGENTS.md §7.3).
 * Kural: Akışta yalnızca gerçek içerik öğeleri (yayınlar ve proje vaka analizleri) bulunur;
 * statik sayfalar akışa eklenmez. pubDate değerleri gerçek yayın tarihidir (frontmatter veya
 * git ilk commit tarihi) — build anı ASLA kullanılmaz; aksi halde her deploy tüm öğeleri "yeni" gösterir.
 */
interface RssItem {
  title: string;
  link: string;
  description: string;
  date: Date;
  lang: 'tr' | 'en';
  categories: string[];
}

const xmlEscape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const cdata = (s: string) => `<![CDATA[${s.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;

export const GET: APIRoute = async () => {
  const items: RssItem[] = [];

  const broadcasts = await getCollection('broadcasts');
  for (const b of broadcasts) {
    const lang = b.data.lang;
    const slug = b.id.replace(/^(tr|en)\//, '');
    items.push({
      title: b.data.title,
      link: `${SITE_URL}${lang === 'tr' ? '' : '/en'}/broadcasts/${slug}/`,
      description: b.data.seoDescription ?? b.data.description,
      date: b.data.pubDate,
      lang,
      categories: b.data.tags
    });
  }

  for (const lang of ['tr', 'en'] as const) {
    const projects = await getAllProjects(lang);
    for (const p of projects) {
      const path = `${lang === 'tr' ? '' : '/en'}/projects/${p.slug}/`;
      const published = firstPublished(path);
      if (!published) continue; // tarihi bilinmeyen öğe akışa sahte tarihle girmez
      items.push({
        title: `${p.title} — ${lang === 'tr' ? 'Mimari Vaka Analizi' : 'Architecture Case Study'}`,
        link: `${SITE_URL}${path}`,
        description: p.seoDescription ?? p.description,
        date: new Date(published),
        lang,
        categories: p.tags
      });
    }
  }

  items.sort((a, b) => b.date.getTime() - a.date.getTime());

  // lastBuildDate = akıştaki en güncel içerik değişikliği (deterministik)
  const latestChange = Math.max(
    ...items.map((i) => {
      const lm = lastModified(new URL(i.link).pathname);
      return Math.max(i.date.getTime(), lm ? Date.parse(lm) : 0);
    })
  );

  const body = items
    .map(
      (item) => `    <item>
      <title>${cdata(item.title)}</title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <pubDate>${item.date.toUTCString()}</pubDate>
      <dc:creator>${cdata(PERSON.name)}</dc:creator>
      <dc:language>${item.lang}</dc:language>
${item.categories.map((c) => `      <category>${xmlEscape(c)}</category>`).join('\n')}
      <description>${cdata(item.description)}</description>
    </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Onur Aksoy — Yayınlar ve Vaka Analizleri</title>
    <link>${SITE_URL}/</link>
    <description>Onur Aksoy (a.k.a. Hackonomist) — ${PERSON.jobTitle.tr}: teknik yayınlar, mimari makaleler ve proje vaka analizleri (TR/EN).</description>
    <language>tr-TR</language>
    <lastBuildDate>${new Date(latestChange).toUTCString()}</lastBuildDate>
    <atom:link href="https://pubsubhubbub.appspot.com/" rel="hub" />
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${body}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
  });
};
