/**
 * scripts/ping-search-engines.mjs
 * 
 * 1. Google WebSub (PubSubHubbub) Ping: Notifies Google of real-time RSS updates.
 * 2. IndexNow Protocol Ping: Notifies Bing, ChatGPT/OAI-SearchBot, Yandex, DuckDuckGo of updated URLs.
 */

const KEY = 'd8a9f2e4c1b7460395e2a1c8f0b3d7e9';
const HOST = 'onuraksoy.com.tr';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const urlList = [
  // Core Pages (TR Root)
  `https://${HOST}/`,
  `https://${HOST}/about/`,
  `https://${HOST}/projects/`,
  `https://${HOST}/broadcasts/`,
  `https://${HOST}/contact/`,

  // Core Pages (EN)
  `https://${HOST}/en/`,
  `https://${HOST}/en/about/`,
  `https://${HOST}/en/projects/`,
  `https://${HOST}/en/broadcasts/`,
  `https://${HOST}/en/contact/`,

  // Projects (TR & EN)
  `https://${HOST}/projects/oapos/`,
  `https://${HOST}/projects/oadub/`,
  `https://${HOST}/projects/10sec/`,
  `https://${HOST}/projects/orvyna-app-studio/`,
  `https://${HOST}/projects/oa-sip-recorder/`,
  `https://${HOST}/projects/ecommerce-image-enhancer/`,
  `https://${HOST}/en/projects/oapos/`,
  `https://${HOST}/en/projects/oadub/`,
  `https://${HOST}/en/projects/10sec/`,
  `https://${HOST}/en/projects/orvyna-app-studio/`,
  `https://${HOST}/en/projects/oa-sip-recorder/`,
  `https://${HOST}/en/projects/ecommerce-image-enhancer/`,

  // Broadcasts (TR & EN)
  `https://${HOST}/broadcasts/ai-influencer-consistency-architecture/`,
  `https://${HOST}/broadcasts/ai-native-architecture/`,
  `https://${HOST}/broadcasts/local-first-software/`,
  `https://${HOST}/en/broadcasts/ai-influencer-consistency-architecture/`,
  `https://${HOST}/en/broadcasts/ai-native-architecture/`,
  `https://${HOST}/en/broadcasts/local-first-software/`,

  // Feeds & Machine Discovery
  `https://${HOST}/rss.xml`,
  `https://${HOST}/sitemap-index.xml`,
  `https://${HOST}/sitemap-0.xml`,
  `https://${HOST}/sitemap-video.xml`,
  `https://${HOST}/sitemap-images.xml`,
  `https://${HOST}/llms.txt`,
  `https://${HOST}/llms-full.txt`,
  `https://${HOST}/robots.txt`,

  // Multi-ratio Portraits
  `https://${HOST}/images/onur-aksoy.webp`,
  `https://${HOST}/images/onur-aksoy-1x1.webp`,
  `https://${HOST}/images/onur-aksoy-4x3.webp`,
  `https://${HOST}/images/onur-aksoy-16x9.webp`,
  `https://${HOST}/images/onur-aksoy-og.webp`
];

async function pingWebSub() {
  console.log('📡 [1/2] Pinging Google WebSub Hub (pubsubhubbub.appspot.com)...');
  const hubUrl = 'https://pubsubhubbub.appspot.com/';
  const targets = [
    `https://${HOST}/rss.xml`,
    `https://${HOST}/`
  ];

  for (const target of targets) {
    try {
      const body = new URLSearchParams({
        'hub.mode': 'publish',
        'hub.url': target
      });

      const res = await fetch(hubUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
      });

      console.log(`  -> WebSub ping for ${target}: status ${res.status} (${res.statusText || 'OK'})`);
    } catch (err) {
      console.warn(`  ⚠️ WebSub ping failed for ${target}: ${err.message}`);
    }
  }
}

async function pingIndexNow() {
  console.log('\n🚀 [2/2] Pinging IndexNow Endpoints (Bing, ChatGPT/OAI-SearchBot, Yandex)...');
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList
  };

  const endpoints = [
    { name: 'IndexNow Shared API (Bing / ChatGPT / DuckDuckGo)', url: 'https://api.indexnow.org/indexnow' },
    { name: 'Bing IndexNow Direct', url: 'https://www.bing.com/indexnow' },
    { name: 'Yandex IndexNow Direct', url: 'https://yandex.com/indexnow' }
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      console.log(`  -> ${ep.name}: status ${res.status} (${res.statusText || 'OK'})`);
    } catch (err) {
      console.warn(`  ⚠️ ${ep.name} failed: ${err.message}`);
    }
  }
}

async function main() {
  console.log(`=== Real-Time Search Engine Notification (WebSub + IndexNow) ===`);
  console.log(`Total URLs to submit: ${urlList.length}`);
  await pingWebSub();
  await pingIndexNow();
  console.log('\n✅ Search engine notification process finished.');
}

main().catch((err) => {
  console.error('Fatal error in ping-search-engines:', err);
  process.exit(1);
});
