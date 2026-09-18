import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const content = `User-agent: *
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
Sitemap: https://onuraksoy.com.tr/sitemap.xml
Sitemap: https://onuraksoy.com.tr/sitemap-index.xml
Sitemap: https://onuraksoy.com.tr/sitemap-video.xml
Sitemap: https://onuraksoy.com.tr/sitemap-images.xml
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    }
  });
};
