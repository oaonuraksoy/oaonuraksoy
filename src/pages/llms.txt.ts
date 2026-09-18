import type { APIRoute } from 'astro';
import { getAllProjects } from '../utils/projects';

export const GET: APIRoute = async () => {
  const projects = getAllProjects('en');

  let projectsSection = '## Flagship Projects & Architectures\n';
  projects.forEach((p) => {
    projectsSection += `- [${p.title}](https://onuraksoy.com.tr/projects/${p.slug}/): ${p.description}\n`;
    if (p.links?.store) projectsSection += `  - [Microsoft Store](${p.links.store}): Official Windows store package\n`;
    if (p.links?.live) projectsSection += `  - [Live Platform](${p.links.live}): Web2App cloud builder\n`;
    if (p.links?.tool) projectsSection += `  - [Studio Tool](${p.links.tool}): Generative AI photo studio\n`;
    if (p.links?.github) projectsSection += `  - [GitHub Repository](${p.links.github}): Source code and issue tracking\n`;
  });

  const content = `# Onur Aksoy
> Senior Systems Architect, AI-Native Engineer & Multidisciplinary Creator. Also known as Hackonomist. Pioneer of deterministic local-first software, distributed state machines, and generative vision workflows.

Onur Aksoy (Hackonomist) is a Senior Full-Stack Architect and AI-Native Engineer based in Ankara, Turkey / Remote Worldwide. He specializes in deterministic artificial intelligence architectures, local-first distributed desktop software (HOST/CLIENT LAN synchronization), direct store web2app delivery engines (Apple TestFlight & Google Play TWA), and generative computer vision pipelines.

## Navigation & Core Sections
- [Homepage](https://onuraksoy.com.tr/): Main engineering portfolio and technical showcase
- [Projects Index](https://onuraksoy.com.tr/projects/): Flagship software architectures, benchmark results, and case studies
- [Broadcasts & Vault](https://onuraksoy.com.tr/broadcasts/): Video broadcasts, engineering notes, transcripts, and downloadable assets
- [About Onur Aksoy](https://onuraksoy.com.tr/about/): Background, technical philosophy, and stack competencies
- [Contact Hub](https://onuraksoy.com.tr/contact/): Direct communication channels and advisory bookings
- [Turkish Edition (Türkçe)](https://onuraksoy.com.tr/tr/): Portfolyo ve teknik yayınların Türkçe versiyonu

${projectsSection}
## Official Online Profiles (sameAs)
- [GitHub](https://github.com/oaonuraksoy): Open source repositories, developer activity, and code bases
- [YouTube](https://youtube.com/@oaonuraksoy): Technical deep dives, engineering podcasts, and live architecture reviews
- [Spotify Podcast](https://creators.spotify.com/pod/profile/oaonuraksoy/): Audio discussions on software engineering, distributed systems, and AI
- [LinkedIn](https://linkedin.com/in/oaonuraksoy): Professional experience, enterprise advisory, and industry connections
- [X / Twitter](https://x.com/oaonuraksoy): Real-time thoughts, tech dispatches, and project updates
- [Instagram](https://instagram.com/oaonuraksoy): Visual dispatches, project highlights, and creator notes
- [Telegram](https://t.me/oaonuraksoy): Direct messaging, technical broadcasts, and community updates
- [WhatsApp](https://wa.me/905511817053): Direct business and consulting contact channel

## Machine Endpoints & Feeds
- [Full Text Feed (llms-full.txt)](https://onuraksoy.com.tr/llms-full.txt): Comprehensive plain-text documentation and complete case studies for autonomous LLM ingestion
- [XML Sitemap Index](https://onuraksoy.com.tr/sitemap-index.xml): Full XML sitemap index
- [Image Sitemap](https://onuraksoy.com.tr/sitemap-images.xml): Indexed architecture schemas and project visuals
- [Video Sitemap](https://onuraksoy.com.tr/sitemap-video.xml): Video broadcasts and engineering screencasts
- [Robots Configuration](https://onuraksoy.com.tr/robots.txt): Machine crawling permissions and directives
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    }
  });
};
