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
  stackTitle: z.string().optional(),
  techStack: z.array(techStackItemSchema),
  businessImpact: z.string().optional(),
  // <title> için kısa SEO başlığı (marka eki ' | Onur Aksoy' otomatik eklenir; toplam ≤ 60 karakter)
  seoTitle: z.string().max(47).optional(),
  // meta description (110–160 karakter)
  seoDescription: z.string().min(110).max(160).optional()
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
      appStore: z.string().url().optional(),
      playStore: z.string().url().optional(),
      github: z.string().url().optional(),
      demo: z.string().url().optional(),
      tool: z.string().url().optional()
    }).optional(),
    // SoftwareApplication JSON-LD alanları (gerçek mağaza/platform verisi)
    schema: z.object({
      applicationCategory: z.string(),
      operatingSystem: z.string(),
      price: z.string().default('0'),
      priceCurrency: z.string().default('USD')
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
    // <title> için kısa SEO başlığı (marka eki otomatik; toplam ≤ 60 karakter) ve meta description
    seoTitle: z.string().max(47).optional(),
    seoDescription: z.string().min(110).max(160).optional(),
    pubDate: z.coerce.date(),
    // İçerik gerçekten güncellendiğinde (yalnızca SEO/meta düzeltmesi değil) eklenir → dateModified / lastmod
    updatedDate: z.coerce.date().optional(),
    lang: z.enum(['en', 'tr']).default('en'),
    ref: z.string(),
    doi: z.string().optional(),
    scholarlyPaper: z.object({
      title: z.string(),
      publicationDate: z.string(),
      pdfPath: z.string(),
      zenodoRecordId: z.string(),
      language: z.string().default('en')
    }).optional(),
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
    mermaidTopology: z.string().optional(),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string()
    })).default([])
  })
});

export const collections = { projects, broadcasts };
