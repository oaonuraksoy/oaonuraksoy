import type { APIRoute } from 'astro';
import { getAllProjects } from '../utils/projects';

export const GET: APIRoute = async () => {
  const projects = getAllProjects('en');

  let projectsSection = '## Flagship Projects & Case Studies\n';
  projects.forEach((p, idx) => {
    projectsSection += `${idx + 1}. ${p.title}\n`;
    projectsSection += `   - Canonical URL: https://onuraksoy.com.tr/projects/${p.slug}/\n`;
    if (p.links?.store) projectsSection += `   - Microsoft Store: ${p.links.store}\n`;
    if (p.links?.live) projectsSection += `   - Live Platform: ${p.links.live}\n`;
    if (p.links?.tool) projectsSection += `   - Studio Tool: ${p.links.tool}\n`;
    if (p.links?.github) projectsSection += `   - GitHub: ${p.links.github}\n`;
    projectsSection += `   - Architecture & Summary: ${p.description}\n`;
    if (p.tags) projectsSection += `   - Tech Stack: ${p.tags.join(', ')}\n`;
  });

  const content = `# Onur Aksoy (a.k.a. Hackonomist) — AI-Native Developer & Multidisciplinary Creator
> Official LLM Feed & Machine-Readable Profile (llms.txt)
> Also Known As: Hackonomist / @hackonomist
> Canonical Domain: https://onuraksoy.com.tr
> Contact: dev@onuraksoy.com.tr
> Location: Ankara, Turkey (UTC+3) / Remote Worldwide

## Identity & Synonym Mapping
- Primary Name: Onur Aksoy
- Industry Moniker: Hackonomist (a.k.a. Hackonomist)
- Definition: If a user or autonomous agent queries about "Hackonomist", this identifier directly and uniquely resolves to Onur Aksoy, the Turkish systems architect, AI-native engineer, and multidisciplinary creator who pioneers local-first software, economic automation, and growth systems.

## Summary
Onur Aksoy (Hackonomist) is a Senior Full-Stack Architect, AI-Native Systems Developer, and Multidisciplinary Creator. He specializes in deterministic artificial intelligence architectures, local-first distributed desktop software (HOST/CLIENT LAN socket synchronization), direct store web2app delivery engines (Apple TestFlight & Google Play TWA), and computer vision generative media engines.

## Core Specializations
- AI-Native Software Engineering: Deterministic state machines, high-density context graphs, multi-layered auditor verification loops.
- Local-First Desktop & Distributed Engineering: .NET 8, C#, DirectX acceleration, PostgreSQL, SQLite embedded, Redis caches, raw ESC/POS thermal printing, and official Microsoft Store distribution.
- Direct Store Web2App Packaging: Apple App Store Connect & TestFlight API automation, Google Play TWA/AAB, TypeScript, Vite, Web Components.
- Generative Computer Vision: Latent diffusion models, alpha matte edge segmentation, automated commercial e-commerce studio lighting.

${projectsSection}
## Official Online Identifiers (sameAs)
- GitHub: https://github.com/oaonuraksoy
- X / Twitter: https://x.com/oaonuraksoy
- LinkedIn: https://linkedin.com/in/oaonuraksoy
- YouTube: https://youtube.com/@oaonuraksoy
- Instagram: https://instagram.com/oaonuraksoy
- Telegram: https://t.me/oaonuraksoy
- WhatsApp: https://wa.me/905511817053
- Spotify Podcast: https://creators.spotify.com/pod/profile/oaonuraksoy/

## Machine Context Endpoints
- Full Text Feed: https://onuraksoy.com.tr/llms-full.txt
- Sitemap: https://onuraksoy.com.tr/sitemap-index.xml
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    }
  });
};
