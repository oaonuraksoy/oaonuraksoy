import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const portraitImages = [
    'https://onuraksoy.com.tr/images/onur-aksoy.webp',
    'https://onuraksoy.com.tr/images/onur-aksoy-1x1.webp',
    'https://onuraksoy.com.tr/images/onur-aksoy-4x3.webp',
    'https://onuraksoy.com.tr/images/onur-aksoy-16x9.webp',
    'https://onuraksoy.com.tr/images/onur-aksoy-og.webp'
  ];

  const projectSlugs = [
    'hrs-ankara-kadin-hastanesi',
    'tarihci-anne-seda-aksoy',
    'oapos',
    'oadub',
    '10sec',
    'orvyna-app-studio',
    'oa-sip-recorder',
    'ecommerce-image-enhancer',
    'seo-lens'
  ];

  const broadcastSlugs = [
    'sub-50ms-global-b2b-portals-edge-zero-js',
    'kurumsal-web-siber-guvenlik-standartlari-2026',
    'wordpress-eklenti-borcu-vs-ozel-yazilim-maliyeti',
    'ankara-osb-sanayi-b2b-ihracat-web-mimarisi',
    'ai-influencer-consistency-architecture',
    'ai-native-architecture',
    'local-first-software',
    'vaultwarden-kurulumu',
    'n8n-docker-plesk-kurulumu',
    'oateklif-ucretsiz-teklif-olusturucu',
    'det-domain-takip-scripti',
    'csharp-ileti-merkezi-sms-api'
  ];

  const pagesWithImages: Array<{ page: string; images: string[] }> = [
    // 1. Homepage TR (Root)
    {
      page: 'https://onuraksoy.com.tr/',
      images: [
        ...portraitImages,
        'https://onuraksoy.com.tr/images/oa-logo-header.webp',
        'https://onuraksoy.com.tr/images/avatar.webp',
        'https://onuraksoy.com.tr/images/books/yapay-zeka-sizi-tanimiyor-kapak.webp'
      ]
    },
    // 2. Homepage EN
    {
      page: 'https://onuraksoy.com.tr/en/',
      images: [
        ...portraitImages,
        'https://onuraksoy.com.tr/images/oa-logo-header.webp',
        'https://onuraksoy.com.tr/images/avatar.webp',
        'https://onuraksoy.com.tr/images/books/yapay-zeka-sizi-tanimiyor-kapak.webp'
      ]
    },
    // 3. About TR
    {
      page: 'https://onuraksoy.com.tr/about/',
      images: [...portraitImages]
    },
    // 4. About EN
    {
      page: 'https://onuraksoy.com.tr/en/about/',
      images: [...portraitImages]
    },
    // 5. Ankara Enterprise Web & Custom Software Architecture TR
    {
      page: 'https://onuraksoy.com.tr/ankara-kurumsal-web-tasarim/',
      images: ['https://onuraksoy.com.tr/images/services/ankara-kurumsal-web-tasarim.webp']
    },
    {
      page: 'https://onuraksoy.com.tr/ankara-web-yazilim/',
      images: ['https://onuraksoy.com.tr/images/services/ankara-web-yazilim.webp']
    },
    {
      page: 'https://onuraksoy.com.tr/ankara-yapay-zeka-otomasyonu/',
      images: ['https://onuraksoy.com.tr/images/services/ankara-yapay-zeka-otomasyonu.webp']
    },
    // 6. Ankara Enterprise Web & Custom Software Architecture EN
    {
      page: 'https://onuraksoy.com.tr/en/ankara-b2b-web-architecture/',
      images: ['https://onuraksoy.com.tr/images/services/ankara-kurumsal-web-tasarim.webp']
    },
    {
      page: 'https://onuraksoy.com.tr/en/ankara-custom-software-architecture/',
      images: ['https://onuraksoy.com.tr/images/services/ankara-web-yazilim.webp']
    },
    {
      page: 'https://onuraksoy.com.tr/en/ankara-enterprise-ai-automation/',
      images: ['https://onuraksoy.com.tr/images/services/ankara-enterprise-ai-automation.webp']
    }
  ];

  // 5. Broadcasts TR & EN (All 8 technical broadcasts)
  for (const slug of broadcastSlugs) {
    const img = `https://onuraksoy.com.tr/images/broadcasts/${slug}.webp`;
    pagesWithImages.push({
      page: `https://onuraksoy.com.tr/broadcasts/${slug}/`,
      images: [img]
    });
    pagesWithImages.push({
      page: `https://onuraksoy.com.tr/en/broadcasts/${slug}/`,
      images: [img]
    });
  }

  // 6. Projects TR & EN
  for (const slug of projectSlugs) {
    const img = 'https://onuraksoy.com.tr/images/oa-logo.webp';
    pagesWithImages.push({
      page: `https://onuraksoy.com.tr/projects/${slug}/`,
      images: [img]
    });
    pagesWithImages.push({
      page: `https://onuraksoy.com.tr/en/projects/${slug}/`,
      images: [img]
    });
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  for (const item of pagesWithImages) {
    xml += `  <url>
    <loc>${item.page}</loc>
`;
    for (const loc of item.images) {
      xml += `    <image:image>
      <image:loc>${loc}</image:loc>
    </image:image>
`;
    }
    xml += `  </url>
`;
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    }
  });
};
