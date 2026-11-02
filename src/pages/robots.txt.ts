import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const content = `User-agent: *
Allow: /

# Search Engine Crawlers
User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: Bingbot
Allow: /

User-agent: OAI-SearchBot
Allow: /

# Explicit AI Search & LLM Discovery Permissions
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

# Sitemaps
Sitemap: https://onuraksoy.com.tr/sitemap-index.xml
Sitemap: https://onuraksoy.com.tr/sitemap-video.xml
Sitemap: https://onuraksoy.com.tr/sitemap-images.xml

# Feeds & Machine Discovery
# WebSub RSS Feed: https://onuraksoy.com.tr/rss.xml
# LLMs Text: https://onuraksoy.com.tr/llms.txt
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    }
  });
};
