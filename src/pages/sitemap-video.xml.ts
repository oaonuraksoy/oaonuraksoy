import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const broadcasts = await getCollection('broadcasts', ({ data }) => !!data.youtubeId);

  // Convert ISO duration "PT24M15S" to seconds
  function parseDurationToSeconds(duration?: string): number {
    if (!duration) return 900;
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 900;
    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);
    return hours * 3600 + minutes * 60 + seconds;
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

  for (const b of broadcasts) {
    const isTr = b.data.lang === 'tr';
    const slug = isTr ? b.id.replace(/^tr\//, '') : b.id.replace(/^en\//, '');
    const canonical = isTr 
      ? `https://onuraksoy.com.tr/tr/broadcasts/${slug}/`
      : `https://onuraksoy.com.tr/broadcasts/${slug}/`;

    const thumb = `https://i.ytimg.com/vi/${b.data.youtubeId}/maxresdefault.jpg`;
    const durationSec = parseDurationToSeconds(b.data.duration);

    xml += `  <url>
    <loc>${canonical}</loc>
    <video:video>
      <video:thumbnail_loc>${thumb}</video:thumbnail_loc>
      <video:title><![CDATA[${b.data.title}]]></video:title>
      <video:description><![CDATA[${b.data.description}]]></video:description>
      <video:player_loc>https://www.youtube-nocookie.com/embed/${b.data.youtubeId}</video:player_loc>
      <video:duration>${durationSec}</video:duration>
      <video:publication_date>${b.data.pubDate.toISOString()}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:uploader info="https://onuraksoy.com.tr">Onur Aksoy</video:uploader>
    </video:video>
  </url>
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
