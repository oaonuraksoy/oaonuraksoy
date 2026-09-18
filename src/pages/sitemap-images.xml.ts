import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const images = [
    // Homepage & Core Identity
    {
      page: 'https://onuraksoy.com.tr/',
      loc: 'https://onuraksoy.com.tr/images/onur-aksoy.webp',
      title: 'Onur Aksoy — AI-Native Developer & Multidisciplinary Creator'
    },
    {
      page: 'https://onuraksoy.com.tr/',
      loc: 'https://onuraksoy.com.tr/images/oa-logo-header.webp',
      title: 'Onur Aksoy Monogram Header Logo'
    },
    {
      page: 'https://onuraksoy.com.tr/',
      loc: 'https://onuraksoy.com.tr/images/avatar.webp',
      title: 'Onur Aksoy (Hackonomist) Profile Avatar'
    },
    {
      page: 'https://onuraksoy.com.tr/about/',
      loc: 'https://onuraksoy.com.tr/images/onur-aksoy.webp',
      title: 'Onur Aksoy Portrait — Engineering Philosophy & Bio'
    },

    // Broadcasts (Video Screencasts & Deep Dives)
    {
      page: 'https://onuraksoy.com.tr/broadcasts/ai-influencer-consistency-architecture/',
      loc: 'https://onuraksoy.com.tr/images/broadcasts/ai-influencer-consistency-architecture.webp',
      title: 'AI Influencer Account Bans & Consistency Architecture Breakdown'
    },
    {
      page: 'https://onuraksoy.com.tr/broadcasts/ai-native-architecture/',
      loc: 'https://onuraksoy.com.tr/images/broadcasts/ai-native-architecture.webp',
      title: 'The AI-Native Architecture: Deterministic State Machines'
    },
    {
      page: 'https://onuraksoy.com.tr/broadcasts/local-first-software/',
      loc: 'https://onuraksoy.com.tr/images/broadcasts/local-first-software.webp',
      title: 'The Renaissance of Local-First Software Development'
    },

    // Projects (Case Studies)
    {
      page: 'https://onuraksoy.com.tr/projects/oapos/',
      loc: 'https://onuraksoy.com.tr/images/oa-logo.webp',
      title: 'oaPOS — Windows Desktop POS & Real-Time Inventory Architecture'
    },
    {
      page: 'https://onuraksoy.com.tr/projects/orvyna-app-studio/',
      loc: 'https://onuraksoy.com.tr/images/oa-logo.webp',
      title: 'Orvyna App Studio — Cloud Web2App Architecture & Native Delivery Engine'
    },
    {
      page: 'https://onuraksoy.com.tr/projects/ecommerce-image-enhancer/',
      loc: 'https://onuraksoy.com.tr/images/oa-logo.webp',
      title: 'E-Commerce Image Enhancement Tool — AI Product Visual Studio'
    },

    // Turkish Counterparts
    {
      page: 'https://onuraksoy.com.tr/tr/',
      loc: 'https://onuraksoy.com.tr/images/onur-aksoy.webp',
      title: 'Onur Aksoy — Yapay Zeka Yerel Geliştirici & Çok Disiplinli Yaratıcı'
    },
    {
      page: 'https://onuraksoy.com.tr/tr/about/',
      loc: 'https://onuraksoy.com.tr/images/onur-aksoy.webp',
      title: 'Onur Aksoy — Mimari Felsefe ve Biyografi'
    },
    {
      page: 'https://onuraksoy.com.tr/tr/broadcasts/ai-influencer-consistency-architecture/',
      loc: 'https://onuraksoy.com.tr/images/broadcasts/ai-influencer-consistency-architecture.webp',
      title: 'AI Influencer Hesap Kapanmaları & Kararlılık Mimarisi İncelemesi'
    },
    {
      page: 'https://onuraksoy.com.tr/tr/broadcasts/ai-native-architecture/',
      loc: 'https://onuraksoy.com.tr/images/broadcasts/ai-native-architecture.webp',
      title: 'Yapay Zeka Yerel Mimari: Basit Chatbot Sarmalayıcılarının Ötesi'
    },
    {
      page: 'https://onuraksoy.com.tr/tr/broadcasts/local-first-software/',
      loc: 'https://onuraksoy.com.tr/images/broadcasts/local-first-software.webp',
      title: 'Yerel Öncelikli (Local-First) Yazılım Geliştirmenin Rönesansı'
    },
    {
      page: 'https://onuraksoy.com.tr/tr/projects/oapos/',
      loc: 'https://onuraksoy.com.tr/images/oa-logo.webp',
      title: 'oaPOS — Windows Masaüstü Satış Noktası ve Envanter Mimarisi'
    },
    {
      page: 'https://onuraksoy.com.tr/tr/projects/orvyna-app-studio/',
      loc: 'https://onuraksoy.com.tr/images/oa-logo.webp',
      title: 'Orvyna App Studio — Bulut Web2App Mimarisi ve Yerel Dağıtım Motoru'
    },
    {
      page: 'https://onuraksoy.com.tr/tr/projects/ecommerce-image-enhancer/',
      loc: 'https://onuraksoy.com.tr/images/oa-logo.webp',
      title: 'E-Ticaret Görsel Geliştirme Aracı — Yapay Zeka Ürün Stüdyosu'
    }
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="https://onuraksoy.com.tr/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  images.forEach((img) => {
    xml += `  <url>
    <loc>${img.page}</loc>
    <image:image>
      <image:loc>${img.loc}</image:loc>
      <image:title><![CDATA[${img.title}]]></image:title>
    </image:image>
  </url>
`;
  });

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    }
  });
};
