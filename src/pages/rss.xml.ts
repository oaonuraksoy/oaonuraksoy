import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getAllProjects } from '../utils/projects';

export const GET: APIRoute = async () => {
  const siteUrl = 'https://onuraksoy.com.tr';
  const projectsTr = await getAllProjects('tr');
  const projectsEn = await getAllProjects('en');
  const broadcasts = await getCollection('broadcasts');
  broadcasts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  interface RssItem {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    guid: string;
  }

  const items: RssItem[] = [];
  const nowRfc822 = new Date().toUTCString();

  // Core Pages (TR)
  const corePagesTr = [
    { title: 'Onur Aksoy — Kıdemli Yazılım Mimarı & Yapay Zeka Yerel Geliştirici', path: '/', desc: 'Onur Aksoy (Hackonomist) kişisel portfolyo ve sistem mimarisi ana sayfası.' },
    { title: 'Ankara Kurumsal Web Tasarım & B2B Sistem Mimarisi — Onur Aksoy', path: '/ankara-kurumsal-web-tasarim/', desc: 'Ankara OSB, İvedik, OSTİM ve Sincan sanayi şirketleri için sub-50ms küresel B2B web mimarisi ve ihracat vitrini.' },
    { title: 'Ankara Web Yazılım & Özel Sistem Geliştirme — Onur Aksoy', path: '/ankara-web-yazilim/', desc: 'Ankara merkezli kurumsal şirketler için özel web yazılımı, Rust & C# mikroservis mimarileri ve güvenli veritabanı sistemleri.' },
    { title: 'Hakkında — Onur Aksoy', path: '/about/', desc: 'Mühendislik felsefesi, arka plan, teknik yetkinlikler ve biyografi.' },
    { title: 'Projeler — Onur Aksoy', path: '/projects/', desc: 'Amiral gemisi yazılım mimarileri, masaüstü, web ve AI sistemleri.' },
    { title: 'Yayınlar & Kasa — Onur Aksoy', path: '/broadcasts/', desc: 'Teknik video yayınları, mimari makaleler ve indirilebilir mühendislik arşivleri.' },
    { title: 'İletişim — Onur Aksoy', path: '/contact/', desc: 'Danışmanlık ve teknik iş birliği doğrudan iletişim kanalları.' }
  ];

  for (const page of corePagesTr) {
    items.push({
      title: page.title,
      link: `${siteUrl}${page.path}`,
      description: page.desc,
      pubDate: nowRfc822,
      guid: `${siteUrl}${page.path}`
    });
  }

  // Core Pages (EN)
  const corePagesEn = [
    { title: 'Onur Aksoy — Senior Systems Architect & AI-Native Developer', path: '/en/', desc: 'Onur Aksoy (Hackonomist) personal portfolio and systems architecture showcase.' },
    { title: 'Ankara Enterprise Web Design & B2B Architecture — Onur Aksoy', path: '/en/ankara-b2b-web-architecture/', desc: 'Sub-50ms global B2B web architectures, zero-JS export showcases for Ankara industrial leaders.' },
    { title: 'Ankara Custom Software Development & Systems Architecture — Onur Aksoy', path: '/en/ankara-custom-software-architecture/', desc: 'Custom enterprise web software, high-performance Rust/.NET backend systems, and secure database architectures in Ankara.' },
    { title: 'About Onur Aksoy', path: '/en/about/', desc: 'Engineering philosophy, background, core competencies, and biography.' },
    { title: 'Projects — Onur Aksoy', path: '/en/projects/', desc: 'Flagship software architectures, desktop systems, web, and AI solutions.' },
    { title: 'Broadcasts & Vault — Onur Aksoy', path: '/en/broadcasts/', desc: 'Technical video broadcasts, architecture screencasts, and downloadable engineering blueprints.' },
    { title: 'Contact — Onur Aksoy', path: '/en/contact/', desc: 'Direct advisory and engineering collaboration channels.' }
  ];

  for (const page of corePagesEn) {
    items.push({
      title: page.title,
      link: `${siteUrl}${page.path}`,
      description: page.desc,
      pubDate: nowRfc822,
      guid: `${siteUrl}${page.path}`
    });
  }

  // Projects (TR & EN)
  for (const p of projectsTr) {
    items.push({
      title: `${p.title} — Mimari Vaka Analizi`,
      link: `${siteUrl}/projects/${p.slug}/`,
      description: p.description,
      pubDate: nowRfc822,
      guid: `${siteUrl}/projects/${p.slug}/`
    });
  }

  for (const p of projectsEn) {
    items.push({
      title: `${p.title} — Architectural Case Study`,
      link: `${siteUrl}/en/projects/${p.slug}/`,
      description: p.description,
      pubDate: nowRfc822,
      guid: `${siteUrl}/en/projects/${p.slug}/`
    });
  }

  // Broadcasts
  for (const b of broadcasts) {
    const isTr = b.data.lang === 'tr';
    const slug = isTr ? b.id.replace(/^tr\//, '') : b.id.replace(/^en\//, '');
    const canonical = isTr ? `${siteUrl}/broadcasts/${slug}/` : `${siteUrl}/en/broadcasts/${slug}/`;
    items.push({
      title: b.data.title,
      link: canonical,
      description: b.data.description,
      pubDate: b.data.pubDate.toUTCString(),
      guid: canonical
    });
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Onur Aksoy — Mimari Yayınlar, Projeler ve Sistemler</title>
    <link>https://onuraksoy.com.tr</link>
    <description>Onur Aksoy (a.k.a. Hackonomist) resmi teknik yayın, proje ve sistem mimarisi akışı.</description>
    <language>tr-TR</language>
    <lastBuildDate>${nowRfc822}</lastBuildDate>
    <atom:link href="https://pubsubhubbub.appspot.com/" rel="hub" />
    <atom:link href="https://onuraksoy.com.tr/rss.xml" rel="self" type="application/rss+xml" />
`;

  for (const item of items) {
    xml += `    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description><![CDATA[${item.description}]]></description>
    </item>
`;
  }

  xml += `  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
