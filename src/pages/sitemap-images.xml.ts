import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const images = [
    {
      page: 'https://onuraksoy.com.tr/',
      loc: 'https://onuraksoy.com.tr/images/avatar.webp',
      title: 'Onur Aksoy (Hackonomist) Profile Avatar'
    },
    {
      page: 'https://onuraksoy.com.tr/',
      loc: 'https://onuraksoy.com.tr/images/oa-logo-header.webp',
      title: 'Onur Aksoy Monogram Logo'
    },
    {
      page: 'https://onuraksoy.com.tr/projects/oapos/',
      loc: 'https://onuraksoy.com.tr/images/avatar.webp',
      title: 'oaPOS Architecture and Terminal Overview'
    },
    {
      page: 'https://onuraksoy.com.tr/projects/orvyna-builder/',
      loc: 'https://onuraksoy.com.tr/images/avatar.webp',
      title: 'Orvyna App Studio Cloud Engine'
    },
    {
      page: 'https://onuraksoy.com.tr/projects/ecommerce-image-enhancement-tool/',
      loc: 'https://onuraksoy.com.tr/images/avatar.webp',
      title: 'AI Product Image Enhancement Studio Pipeline'
    }
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
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
