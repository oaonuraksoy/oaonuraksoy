import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { lastModified } from './src/utils/content-dates.mjs';

const SITE = 'https://onuraksoy.com.tr';

// TR ↔ EN slug'ları farklı olan sayfa çiftleri (@astrojs/sitemap i18n bunları otomatik eşleyemez).
const CROSS_SLUG_PAIRS = [
  ['/ankara-kurumsal-web-tasarim/', '/en/ankara-b2b-web-architecture/'],
  ['/ankara-web-yazilim/', '/en/ankara-custom-software-architecture/'],
  ['/ankara-yapay-zeka-otomasyonu/', '/en/ankara-enterprise-ai-automation/']
];

// https://astro.build/config
export default defineConfig({
  site: SITE,
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
    // DİKKAT: Çıktı dosya adları (sitemap-index.xml, sitemap-0.xml) Google Search Console,
    // Bing ve Yandex Webmaster'a kayıtlıdır — değiştirilemez (AGENTS.md §7.3).
    sitemap({
      i18n: {
        defaultLocale: 'tr',
        locales: {
          tr: 'tr',
          en: 'en'
        }
      },
      serialize(item) {
        const pathname = new URL(item.url).pathname;

        // Gerçek içerik tarihi (git geçmişi); build anı ASLA yazılmaz.
        const lastmod = lastModified(pathname);
        if (lastmod) item.lastmod = lastmod;
        else delete item.lastmod;

        const pair = CROSS_SLUG_PAIRS.find(([tr, en]) => tr === pathname || en === pathname);
        if (pair) {
          item.links = [
            { lang: 'tr', url: `${SITE}${pair[0]}` },
            { lang: 'en', url: `${SITE}${pair[1]}` }
          ];
        }

        // x-default → Türkçe kök sürüm (HTML hreflang ile birebir aynı)
        if (item.links && item.links.length > 0) {
          const tr = item.links.find((l) => l.lang === 'tr');
          if (tr && !item.links.some((l) => l.lang === 'x-default')) {
            item.links.push({ lang: 'x-default', url: tr.url });
          }
        }
        return item;
      }
    }),
    mdx()
  ]
});
