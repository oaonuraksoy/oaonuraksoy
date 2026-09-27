import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const metricItemSchema = z.object({
  label: z.string(),
  value: z.string()
});

const benchmarkTableSchema = z.object({
  title: z.string(),
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string()))
});

const sectionItemSchema = z.object({
  title: z.string(),
  content: z.string()
});

const techStackItemSchema = z.object({
  label: z.string(),
  value: z.string()
});

const localizedContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  role: z.string(),
  period: z.string(),
  status: z.string(),
  executiveOverview: z.string(),
  mermaidTopology: z.string(),
  benchmarks: benchmarkTableSchema,
  sections: z.array(sectionItemSchema),
  techStack: z.array(techStackItemSchema),
  businessImpact: z.string().optional()
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    order: z.number().default(99),
    featured: z.boolean().default(false),
    accentColor: z.string(),
    tags: z.array(z.string()),
    links: z.object({
      live: z.string().url().optional(),
      store: z.string().url().optional(),
      github: z.string().url().optional(),
      demo: z.string().url().optional(),
      tool: z.string().url().optional()
    }).optional(),
    metrics: z.object({
      en: z.array(metricItemSchema),
      tr: z.array(metricItemSchema)
    }),
    en: localizedContentSchema,
    tr: localizedContentSchema
  })
});

const broadcasts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/broadcasts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    lang: z.enum(['en', 'tr']).default('en'),
    ref: z.string(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    youtubeId: z.string().optional(),
    spotifyUrl: z.string().url().optional(),
    duration: z.string().optional(),
    thumbnail: z.string().optional(),
    chapters: z.array(z.object({
      time: z.string(),
      seconds: z.number().optional(),
      title: z.string()
    })).default([]),
    downloads: z.array(z.object({
      name: z.string(),
      size: z.string(),
      type: z.string(),
      driveUrl: z.string(),
      hash: z.string().optional()
    })).default([]),
    mermaidTopology: z.string().optional()
  })
});

export const collections = { projects, broadcasts };
