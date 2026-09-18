import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://onuraksoy.com.tr',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'tr'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    sitemap({
      xslURL: '/sitemap.xsl',
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          tr: 'tr'
        }
      }
    }),
    mdx()
  ]
});
