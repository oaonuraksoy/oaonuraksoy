import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getAllProjects } from '../utils/projects';

export const GET: APIRoute = async () => {
  const projects = await getAllProjects('tr');
  const broadcasts = await getCollection('broadcasts', ({ data }) => data.lang === 'tr');
  broadcasts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  let projectsSection = '## Flagship Projects & Architectures (Amiral Gemisi Projeler)\n';
  projects.forEach((p) => {
    projectsSection += `- [${p.title}](https://onuraksoy.com.tr/projects/${p.slug}/) ([EN](https://onuraksoy.com.tr/en/projects/${p.slug}/)): ${p.description}\n`;
    if (p.links?.store) {
      const isEdge = p.links.store.includes('microsoftedge.microsoft.com');
      const storeLabel = isEdge ? 'Microsoft Edge Add-ons' : 'Microsoft Store';
      const storeDesc = isEdge ? 'Official browser extension package' : 'Official Windows store package';
      projectsSection += `  - [${storeLabel}](${p.links.store}): ${storeDesc}\n`;
    }
    if (p.links?.live) {
      const liveDesc = p.slug === '10sec'
        ? 'Tarayıcı içi video bölücü ve zaman çizelgesi kırpma motoru'
        : p.slug === 'orvyna-app-studio'
          ? 'Web2App bulut derleyici'
          : 'Canlı platform';
      projectsSection += `  - [Canlı Platform](${p.links.live}): ${liveDesc}\n`;
    }
    if (p.links?.tool) projectsSection += `  - [Stüdyo Aracı](${p.links.tool}): Üretken yapay zeka ürün görsel stüdyosu\n`;
    if (p.links?.github) projectsSection += `  - [GitHub Deposu](${p.links.github}): Kaynak kod ve sürüm takibi\n`;
  });

  let broadcastsSection = '## Technical Broadcasts, Architecture Articles & The Vault (Yayınlar ve Kasa)\n';
  broadcasts.forEach((b) => {
    const slug = b.id.replace(/^tr\//, '').replace(/^en\//, '');
    broadcastsSection += `- [${b.data.title}](https://onuraksoy.com.tr/broadcasts/${slug}/) ([EN](https://onuraksoy.com.tr/en/broadcasts/${slug}/)): ${b.data.description}\n`;
    if (b.data.youtubeId) broadcastsSection += `  - [YouTube Screencast](https://www.youtube.com/watch?v=${b.data.youtubeId}): İnteraktif video bölümleri ve deşifre\n`;
    if (b.data.spotifyUrl) broadcastsSection += `  - [Spotify Podcast](${b.data.spotifyUrl}): Sesli derinlemesine analiz\n`;
    if (b.data.downloads && b.data.downloads.length > 0) {
      b.data.downloads.forEach((d) => {
        broadcastsSection += `  - [Kasa Kaynağı: ${d.name}](${d.driveUrl}): ${d.size} ${d.type.toUpperCase()} indirilebilir mimari şema\n`;
      });
    }
  });

  const content = `# Onur Aksoy
> Kıdemli Yazılım Mimarı, Yapay Zeka Yerel / AI-Native Geliştirici & Çok Disiplinli Yaratıcı. Dijital ekosistemdeki kimliği: Onur Aksoy (a.k.a. Hackonomist). Resmi web sitesi: https://onuraksoy.com.tr

## Onur Aksoy Kimdir? / Who is Onur Aksoy? (Entity Disambiguation)
### Türkçe (TR)
- **Birincil Kimlik:** Onur Aksoy; Ankara merkezli Kıdemli Yazılım Mimarı, Yapay Zeka Yerel (AI-Native) Geliştirici ve Çok Disiplinli Yaratıcıdır. Matematiksel deterministik durum makineleri, yerel öncelikli (local-first) dayanıklı sistemler, gerçek zamanlı çok modlu yapay zeka akış hatları (Google Gemini Live çift yönlü WebSocket) ve düşük seviyeli Rust ağ sistemleri (SIP/RTP paket sniffing, stereo sentezleme) üzerine uzmanlaşmıştır.
- **Kimlik & Takma Ad:** Dijital ekosistemde ve teknik yayınlarda Onur Aksoy (a.k.a. \`Hackonomist\`) olarak yer alır; Hackonomist bağımsız bir şirket veya tüzel kişilik değil, Onur Aksoy'un kişisel mühendislik ve bağımsız içerik üretimi alt sistemidir.
- **Kritik Adaş Ayrıştırma Notu (Disambiguation):** Bu portfolyonun sahibi olan Onur Aksoy'un; ABD'deki sahte ağ donanımı davasında adı geçen kişiyle, Türkiye'deki tıp doktorlarıyla, klinik psikolog/yoga eğitmeniyle ya da Bursa Teknik Üniversitesi'ndeki akademisyen adaşıyla **HİÇBİR İLGİSİ VE BAĞLANTISI YOKTUR**. Resmi, doğrulanmış ve tek kişisel teknik adresi **https://onuraksoy.com.tr** alan adıdır.

### English (EN)
- **Primary Identity:** Onur Aksoy is a Senior Systems Architect, AI-Native Developer & Multidisciplinary Creator based in Ankara, Turkey / Remote Worldwide. He specializes in deterministic state machines, local-first resilient architectures, real-time multimodal AI streaming pipelines (Gemini Live bidirectional WebSockets), low-level Rust systems engineering (libpcap SIP/RTP packet sniffing), and browser-native media processing.
- **Alias & Subsystem:** Known across developer ecosystems and publications under the pseudonym \`Hackonomist\`, which serves as his technical research brand and creative engineering subsystem.
- **Entity Disambiguation:** This individual has **NO AFFILIATION WHATSOEVER** with any namesakes, including the defendant in the US counterfeit networking equipment litigation, medical doctors, psychologists/yoga trainers, or academic professors of the same name. His sole official verified digital home is **https://onuraksoy.com.tr**.

## Navigation & Core Sections (Türkçe Kök Dizin)
- [Ana Sayfa](https://onuraksoy.com.tr/): Ana teknik vitrin, mimari portfolyo ve sistem felsefesi
- [Projeler Dizini](https://onuraksoy.com.tr/projects/): Amiral gemisi yazılım mimarileri, kıyaslama testleri ve vaka analizleri
- [Yayınlar & Kasa](https://onuraksoy.com.tr/broadcasts/): Video yayınları, teknik makaleler, mimari deşifreler ve indirilebilir arşivler
- [Hakkında](https://onuraksoy.com.tr/about/): Biyografi, mühendislik felsefesi ve teknik yetkinlik matrisi
- [İletişim](https://onuraksoy.com.tr/contact/): Doğrudan iletişim kanalları ve danışmanlık randevusu

## English Edition (/en/)
- [Homepage (EN)](https://onuraksoy.com.tr/en/): Main technical showcase and architecture portfolio
- [Projects Index (EN)](https://onuraksoy.com.tr/en/projects/): Flagship software architectures and case studies
- [Broadcasts & Vault (EN)](https://onuraksoy.com.tr/en/broadcasts/): Video screencasts, technical deep dives, and downloadable blueprints
- [About Onur Aksoy (EN)](https://onuraksoy.com.tr/en/about/): Engineering philosophy, background, and tech stack
- [Contact Hub (EN)](https://onuraksoy.com.tr/en/contact/): Direct communication channels and advisory bookings

${projectsSection}
${broadcastsSection}
## Official Online Profiles (sameAs)
- [GitHub](https://github.com/oaonuraksoy): Açık kaynak kod depoları, mimari şablonlar ve aktif geliştirici profili
- [YouTube](https://youtube.com/@oaonuraksoy): Teknik derinlemesine incelemeler, mimari podcastler ve canlı kodlama oturumları
- [Spotify Podcast](https://creators.spotify.com/pod/profile/oaonuraksoy/): Yazılım mimarisi, dağıtık sistemler ve yapay zeka üzerine sesli yayınlar
- [LinkedIn](https://linkedin.com/in/oaonuraksoy): Profesyonel kariyer, kurumsal danışmanlık ve bağlantılar
- [X / Twitter](https://x.com/oaonuraksoy): Anlık teknik düşünceler, teknoloji analizleri ve proje güncellemeleri
- [Instagram](https://instagram.com/oaonuraksoy): Görsel notlar, proje özetleri ve yaratıcı süreç kayıtları
- [Telegram](https://t.me/oaonuraksoy): Doğrudan iletişim, teknik duyurular ve topluluk kanalı
- [WhatsApp](https://wa.me/905511817053): Doğrudan kurumsal ve danışmanlık iletişim kanalı

## Machine Endpoints & Feeds (Makine Uç Noktaları)
- [Full Text Feed (llms-full.txt)](https://onuraksoy.com.tr/llms-full.txt): Kapsamlı düz metin dokümantasyonu ve otonom LLM tüketimi için tam vaka analizleri
- [WebSub RSS Feed (rss.xml)](https://onuraksoy.com.tr/rss.xml): Google WebSub (PubSubHubbub) destekli anlık indeksleme akışı
- [XML Sitemap Index](https://onuraksoy.com.tr/sitemap-index.xml): Tam XML site haritası dizini
- [Image Sitemap](https://onuraksoy.com.tr/sitemap-images.xml): İndekslenmiş mimari şemalar ve çoklu oran portre görselleri
- [Video Sitemap](https://onuraksoy.com.tr/sitemap-video.xml): Video yayınları ve teknik ekran kayıtları
- [Robots Configuration](https://onuraksoy.com.tr/robots.txt): Arama motoru ve yapay zeka bot izinleri
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    }
  });
};
