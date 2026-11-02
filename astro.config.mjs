import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://onuraksoy.com.tr',
  i18n: {
    defaultLocale: 'tr',
    locales: ['tr', 'en'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    sitemap({
      i18n: {
        defaultLocale: 'tr',
        locales: {
          tr: 'tr',
          en: 'en'
        }
      },
      serialize(item) {
        item.lastmod = new Date().toISOString();
        return item;
      }
    }),
    mdx()
  ]
});
