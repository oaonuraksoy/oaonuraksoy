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
      driveUrl: z.string().url(),
      hash: z.string().optional()
    })).default([])
  })
});

export const collections = { projects, broadcasts };
