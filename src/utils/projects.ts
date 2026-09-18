import rawProjects from '../data/projects.json';

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface BenchmarkTable {
  title: string;
  headers: string[];
  rows: string[][];
}

export interface ProjectSection {
  title: string;
  content: string;
}

export interface TechStackItem {
  label: string;
  value: string;
}

export interface ProjectLocalizedContent {
  title: string;
  description: string;
  role: string;
  period: string;
  status: string;
  executiveOverview: string;
  mermaidTopology: string;
  benchmarks: BenchmarkTable;
  sections: ProjectSection[];
  techStack: TechStackItem[];
  businessImpact?: string;
}

export interface ProjectRaw {
  id: string;
  slug: string;
  order: number;
  featured: boolean;
  accentColor: string;
  tags: string[];
  links?: {
    store?: string;
    live?: string;
    tool?: string;
    demo?: string;
    github?: string;
  };
  metrics: {
    en: ProjectMetric[];
    tr: ProjectMetric[];
  };
  en: ProjectLocalizedContent;
  tr: ProjectLocalizedContent;
}

export interface ProjectLocalized {
  id: string;
  slug: string;
  order: number;
  featured: boolean;
  accentColor: string;
  tags: string[];
  links?: {
    store?: string;
    live?: string;
    tool?: string;
    demo?: string;
    github?: string;
  };
  metrics: ProjectMetric[];
  lang: 'en' | 'tr';
  title: string;
  description: string;
  role: string;
  period: string;
  status: string;
  executiveOverview: string;
  mermaidTopology: string;
  benchmarks: BenchmarkTable;
  sections: ProjectSection[];
  techStack: TechStackItem[];
  businessImpact?: string;
}

const projectsList = rawProjects as unknown as ProjectRaw[];

export function getAllProjects(lang: 'en' | 'tr' = 'en'): ProjectLocalized[] {
  return projectsList
    .map((p) => {
      const loc = p[lang] || p.en;
      const metrics = p.metrics?.[lang] || p.metrics?.en || [];
      return {
        id: p.id,
        slug: p.slug,
        order: p.order,
        featured: p.featured,
        accentColor: p.accentColor,
        tags: p.tags,
        links: p.links,
        metrics,
        lang,
        title: loc.title,
        description: loc.description,
        role: loc.role,
        period: loc.period,
        status: loc.status,
        executiveOverview: loc.executiveOverview,
        mermaidTopology: loc.mermaidTopology,
        benchmarks: loc.benchmarks,
        sections: loc.sections,
        techStack: loc.techStack,
        businessImpact: loc.businessImpact
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function getFeaturedProjects(lang: 'en' | 'tr' = 'en'): ProjectLocalized[] {
  return getAllProjects(lang).filter((p) => p.featured);
}

export function getProjectBySlug(slug: string, lang: 'en' | 'tr' = 'en'): ProjectLocalized | undefined {
  return getAllProjects(lang).find((p) => p.slug === slug);
}

export function renderMarkdown(md: string): string {
  if (!md) return '';
  const blocks = md.trim().split(/\n\s*\n/);
  const htmlBlocks = blocks.map((block) => {
    const lines = block.trim().split('\n');
    let inList = false;
    let out = '';

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith('- ') || line.startsWith('* ')) {
        if (!inList) {
          out += '<ul class="list-disc list-inside space-y-1.5 my-3 pl-2 text-text-muted">';
          inList = true;
        }
        const itemContent = line.replace(/^[-*]\s+/, '');
        out += `<li class="my-1 leading-relaxed">${formatInline(itemContent)}</li>`;
      } else {
        if (inList) {
          out += '</ul>';
          inList = false;
        }
        out += `<p class="text-text-muted leading-relaxed mb-4">${formatInline(line)}</p>`;
      }
    }

    if (inList) {
      out += '</ul>';
    }
    return out;
  });

  return htmlBlocks.join('\n');
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-text-primary">$1</em>')
    .replace(/`(.+?)`/g, '<code class="text-gold-highlight bg-obsidian-surface px-1.5 py-0.5 rounded border border-obsidian-border font-mono text-xs">$1</code>');
}
