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
    'oapos',
    'oadub',
    '10sec',
    'orvyna-app-studio',
    'oa-sip-recorder',
    'ecommerce-image-enhancer'
  ];

  const broadcastSlugs = [
    'ai-influencer-consistency-architecture',
    'ai-native-architecture',
    'local-first-software'
  ];

  const pagesWithImages: Array<{ page: string; images: string[] }> = [
    // 1. Homepage TR (Root)
    {
      page: 'https://onuraksoy.com.tr/',
      images: [
        ...portraitImages,
        'https://onuraksoy.com.tr/images/oa-logo-header.webp',
        'https://onuraksoy.com.tr/images/avatar.webp'
      ]
    },
    // 2. Homepage EN
    {
      page: 'https://onuraksoy.com.tr/en/',
      images: [
        ...portraitImages,
        'https://onuraksoy.com.tr/images/oa-logo-header.webp',
        'https://onuraksoy.com.tr/images/avatar.webp'
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
    }
  ];

  // 5. Broadcasts TR & EN
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
