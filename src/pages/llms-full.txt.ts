import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getAllProjects } from '../utils/projects';

export const GET: APIRoute = async () => {
  const projectsEn = getAllProjects('en');
  const writingEn = await getCollection('writing', ({ data }) => data.lang === 'en');

  let body = `# Onur Aksoy — Complete Architectural & Technical Digest
> Domain: https://onuraksoy.com.tr
> Identity: AI-Native Developer & Multidisciplinary Creator
> Contact: dev@onuraksoy.com.tr
> Base: Ankara, Turkey (UTC+3)

---

## 1. Professional Overview & Philosophy
Onur Aksoy engineers high-reliability digital systems, rejecting fragile wrapper architectures in favor of mathematically deterministic state machines and verified multi-tiered autonomous agent orchestration.

Key Technical Principles:
1. Determinism over Hallucination: Critical business logic and financial transactions must execute against strictly typed contracts and transactional databases.
2. Local-First Sovereignty: Software must remain 100% functional during cloud or ISP disruptions. Primary ledgers live locally with peer LAN synchronization.
3. Zero-JS & Lightweight Footprints: Web applications and containers should incur minimal runtime bloat and deliver sub-millisecond interaction speeds.

---

## 2. Production Projects

`;

  for (const p of projectsEn) {
    body += `### Project: ${p.title}\n`;
    body += `- Slug: ${p.slug}\n`;
    body += `- Canonical URL: https://onuraksoy.com.tr/projects/${p.slug}/\n`;
    body += `- Role: ${p.role}\n`;
    body += `- Period: ${p.period}\n`;
    body += `- Status: ${p.status}\n`;
    body += `- Summary: ${p.description}\n`;
    if (p.links?.store) body += `- Microsoft Store: ${p.links.store}\n`;
    if (p.links?.live) body += `- Live URL: ${p.links.live}\n`;
    if (p.links?.tool) body += `- Studio Tool: ${p.links.tool}\n`;
    if (p.links?.github) body += `- GitHub: ${p.links.github}\n`;
    if (p.tags && p.tags.length > 0) body += `- Technologies: ${p.tags.join(', ')}\n`;
    if (p.metrics && p.metrics.length > 0) {
      body += `- Key Metrics:\n`;
      p.metrics.forEach((m) => {
        body += `  * ${m.label}: ${m.value}\n`;
      });
    }
    body += `\n#### Executive Overview\n${p.executiveOverview}\n\n`;

    if (p.benchmarks) {
      body += `#### Architectural Benchmark: ${p.benchmarks.title}\n`;
      body += `| ${p.benchmarks.headers.join(' | ')} |\n`;
      body += `| ${p.benchmarks.headers.map(() => '---').join(' | ')} |\n`;
      p.benchmarks.rows.forEach((row) => {
        body += `| ${row.join(' | ')} |\n`;
      });
      body += `\n`;
    }

    if (p.sections && p.sections.length > 0) {
      body += `#### Technical Architecture & Deep-Dive\n`;
      p.sections.forEach((s) => {
        body += `##### ${s.title}\n${s.content}\n\n`;
      });
    }

    if (p.techStack && p.techStack.length > 0) {
      body += `#### Technical Stack Breakdown\n`;
      p.techStack.forEach((t) => {
        body += `- **${t.label}:** ${t.value}\n`;
      });
      body += `\n`;
    }

    if (p.businessImpact) {
      body += `#### Business Impact & Quantifiable Outcomes\n${p.businessImpact}\n\n`;
    }

    body += `---\n\n`;
  }

  body += `## 3. Engineering Essays & Technical Writing\n\n`;

  for (const w of writingEn) {
    body += `### Article: ${w.data.title}\n`;
    body += `- Date: ${w.data.pubDate.toISOString().split('T')[0]}\n`;
    body += `- Summary: ${w.data.description}\n\n`;
    body += `${w.body}\n\n---\n\n`;
  }

  body += `## 4. Channels & Coordinates\n`;
  body += `- Email: dev@onuraksoy.com.tr\n`;
  body += `- GitHub: https://github.com/oaonuraksoy\n`;
  body += `- LinkedIn: https://linkedin.com/in/oaonuraksoy\n`;
  body += `- X: https://x.com/oaonuraksoy\n`;
  body += `- Telegram: https://t.me/oaonuraksoy\n`;
  body += `- WhatsApp: https://wa.me/905511817053\n`;
  body += `- Spotify: https://creators.spotify.com/pod/profile/oaonuraksoy/\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    }
  });
};
