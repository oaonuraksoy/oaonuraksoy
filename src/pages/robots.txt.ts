import type { APIRoute } from 'astro';

/**
 * /robots.txt — Arama motorları ve yapay zeka (GEO/SGE) botları için erişim politikası.
 * Politika: Site herkese açık bir kimlik/portfolyo sitesidir; tüm arama ve AI yanıt motorlarının
 * içeriği okuması ve atıf yapması istenir. Sitemap satırları Google Search Console, Bing ve Yandex
 * Webmaster'a kayıtlı DONDURULMUŞ adlardır (AGENTS.md §7.3) — değiştirilmez.
 */
const SEARCH_BOTS = ['Googlebot', 'Googlebot-Image', 'Googlebot-Video', 'Bingbot', 'YandexBot', 'YandexImages', 'DuckDuckBot', 'Applebot'];
const AI_BOTS = [
  'OAI-SearchBot', 'ChatGPT-User', 'GPTBot',
  'Claude-SearchBot', 'Claude-User', 'ClaudeBot',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot-Extended',
  'Amazonbot', 'Meta-ExternalAgent', 'DuckAssistBot', 'MistralAI-User', 'CCBot'
];

export const GET: APIRoute = async () => {
  const block = (bots: string[]) => bots.map((b) => `User-agent: ${b}\nAllow: /`).join('\n\n');
  const content = `# robots.txt — https://onuraksoy.com.tr
User-agent: *
Allow: /

# Arama motorları / Search engines
${block(SEARCH_BOTS)}

# Yapay zeka arama ve yanıt motorları / AI search & answer engines (GEO)
${block(AI_BOTS)}

# Sitemaps
Sitemap: https://onuraksoy.com.tr/sitemap-index.xml
Sitemap: https://onuraksoy.com.tr/sitemap-video.xml
Sitemap: https://onuraksoy.com.tr/sitemap-images.xml

# Makine keşfi / Machine discovery
# RSS (WebSub): https://onuraksoy.com.tr/rss.xml
# LLMs: https://onuraksoy.com.tr/llms.txt
# LLMs (tam metin): https://onuraksoy.com.tr/llms-full.txt
`;

  return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
