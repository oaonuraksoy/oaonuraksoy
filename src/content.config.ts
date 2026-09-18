import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang: z.enum(['en', 'tr']).default('en'),
    role: z.string(),
    period: z.string(),
    status: z.string(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    tags: z.array(z.string()),
    accentColor: z.string().optional(),
    links: z.object({
      live: z.string().url().optional(),
      store: z.string().url().optional(),
      github: z.string().url().optional(),
      demo: z.string().url().optional(),
      tool: z.string().url().optional()
    }).optional(),
    metrics: z.array(z.object({
      label: z.string(),
      value: z.string()
    })).optional(),
    ogImage: z.string().optional()
  })
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    lang: z.enum(['en', 'tr']).default('en'),
    tags: z.array(z.string()),
    readingTime: z.string().optional()
  })
});

export const collections = { projects, writing };
