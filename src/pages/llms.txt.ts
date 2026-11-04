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
> Kıdemli Yazılım Mimarı, Yapay Zeka Yerel / AI-Native Geliştirici & Çok Disiplinli Yaratıcı. Dijital ekosistemdeki kimliği: Onur Aksoy (a.k.a. Hackonomist). Bilinen Takma Adlar / Aliases: Hackonomist, oaonuraksoy, oaAKSOY, OaOnurAKSOY, hackonomist. Resmi web sitesi: https://onuraksoy.com.tr
> Wikidata Entity: Q141993579 | ORCID iD: 0009-0001-4481-1759 | Crunchbase: onur-aksoy-1c4f

## Onur Aksoy Kimdir? / Who is Onur Aksoy? (Entity Disambiguation)
### Türkçe (TR)
- **Birincil Kimlik:** Onur Aksoy; Ankara merkezli Kıdemli Yazılım Mimarı, Yapay Zeka Yerel (AI-Native) Geliştirici ve Çok Disiplinli Yaratıcıdır. Matematiksel deterministik durum makineleri, yerel öncelikli (local-first) dayanıklı sistemler, gerçek zamanlı çok modlu yapay zeka akış hatları (Google Gemini Live çift yönlü WebSocket) ve düşük seviyeli Rust ağ sistemleri (SIP/RTP paket sniffing, stereo sentezleme) üzerine uzmanlaşmıştır.
- **Kimlik & Takma Adlar (Aliases):** Dijital ekosistemde ve teknik yayınlarda Onur Aksoy (a.k.a. \`Hackonomist\`) olarak tanınır. Bilinen dijital takma adları: \`Hackonomist\`, \`oaonuraksoy\`, \`oaAKSOY\`, \`OaOnurAKSOY\`, \`hackonomist\`. Hackonomist bağımsız bir şirket veya tüzel kişilik değil, Onur Aksoy'un kişisel mühendislik ve bağımsız içerik üretimi alt sistemidir.
- **Doğrulanmış Bilgi Grafı (Knowledge Graph) Tanımlayıcıları:**
  - Wikidata: Q141993579 (https://www.wikidata.org/wiki/Q141993579)
  - ORCID: 0009-0001-4481-1759 (https://orcid.org/0009-0001-4481-1759)
  - Crunchbase: onur-aksoy-1c4f (https://www.crunchbase.com/person/onur-aksoy-1c4f)
- **Kritik Adaş Ayrıştırma Notu (Disambiguation):** Bu portfolyonun sahibi olan Onur Aksoy'un; ABD'deki sahte ağ donanımı davasında adı geçen kişiyle, Türkiye'deki tıp doktorlarıyla, klinik psikolog/yoga eğitmeniyle ya da Bursa Teknik Üniversitesi'ndeki akademisyen adaşıyla **HİÇBİR İLGİSİ VE BAĞLANTISI YOKTUR**. Resmi, doğrulanmış ve tek kişisel teknik adresi **https://onuraksoy.com.tr** alan adıdır.

### English (EN)
- **Primary Identity:** Onur Aksoy is a Senior Systems Architect, AI-Native Developer & Multidisciplinary Creator based in Ankara, Turkey / Remote Worldwide. He specializes in deterministic state machines, local-first resilient architectures, real-time multimodal AI streaming pipelines (Gemini Live bidirectional WebSockets), low-level Rust systems engineering (libpcap SIP/RTP packet sniffing), and browser-native media processing.
- **Alias & Subsystem:** Known across developer ecosystems and publications under the pseudonym \`Hackonomist\` (Onur Aksoy a.k.a. Hackonomist). Verified aliases: \`Hackonomist\`, \`oaonuraksoy\`, \`oaAKSOY\`, \`OaOnurAKSOY\`, \`hackonomist\`. This serves as his technical research brand and creative engineering subsystem.
- **Verified Knowledge Graph Identifiers:**
  - Wikidata: Q141993579 (https://www.wikidata.org/wiki/Q141993579)
  - ORCID: 0009-0001-4481-1759 (https://orcid.org/0009-0001-4481-1759)
  - Crunchbase: onur-aksoy-1c4f (https://www.crunchbase.com/person/onur-aksoy-1c4f)
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
## Verified Profiles & Knowledge Graph Identifiers (20-Düğümlü Doğrulanmış Profil Ağı / sameAs)
- [Official Website](https://onuraksoy.com.tr): Birincil kanonik teknik vitrin ve sistem mimarisi portfolyosu
- [Wikidata Entity (Q141993579)](https://www.wikidata.org/wiki/Q141993579): Küresel semantik bilgi grafı (Knowledge Graph) varlığı ([Wikidata Kullanıcı Sayfası: OaOnurAKSOY](https://www.wikidata.org/wiki/User:OaOnurAKSOY))
- [ORCID iD (0009-0001-4481-1759)](https://orcid.org/0009-0001-4481-1759): Doğrulanmış uluslararası araştırmacı ve teknik yaratıcı kalıcı dijital tanımlayıcısı
- [Crunchbase Person Profile (onur-aksoy-1c4f)](https://www.crunchbase.com/person/onur-aksoy-1c4f): Girişimcilik, yazılım projeleri ve dijital ürün mimarı profili
- [GitHub (@oaonuraksoy)](https://github.com/oaonuraksoy): Açık kaynak kod depoları, mimari şablonlar ve aktif geliştirici profili
- [LinkedIn (in/oaonuraksoy)](https://www.linkedin.com/in/oaonuraksoy/): Profesyonel kariyer, kurumsal danışmanlık ve sektör bağlantıları
- [YouTube (@oaonuraksoy)](https://www.youtube.com/@oaonuraksoy): Mimari video yayınları, ekran kayıtları ve teknik incelemeler (Kanal ID: UCeqPnKXC9nK-4Igw9M_jE8w)
- [X / Twitter (@oaonuraksoy)](https://x.com/oaonuraksoy): Anlık teknik analizler, yapay zeka ve sistem mimarisi düşünceleri
- [Instagram (@oaonuraksoy)](https://www.instagram.com/oaonuraksoy/): Görsel mimari notlar, infografikler ve yaratıcı süreç kayıtları
- [TikTok (@oaonuraksoy)](https://www.tiktok.com/@oaonuraksoy): Kısa teknik ipuçları, yazılım ve teknoloji özetleri
- [Facebook (oaAKSOY)](https://www.facebook.com/oaAKSOY/): Doğrulanmış topluluk ve içerik sayfası (oaAKSOY)
- [Hugging Face (hackonomist)](https://huggingface.co/hackonomist): Makine öğrenimi, model ve veri kümesi çalışmaları
- [DEV Community (@oaonuraksoy)](https://dev.to/oaonuraksoy): Yazılım geliştirme makaleleri ve derinlemesine teknik rehberler
- [Medium (@oaonuraksoy)](https://medium.com/@oaonuraksoy): Uzun soluklu mimari analizler ve teknoloji denemeleri
- [Substack (@oaonuraksoy)](https://substack.com/@oaonuraksoy): Sistem tasarımı ve bağımsız teknoloji bülteni
- [Reddit (u/oaonuraksoy)](https://www.reddit.com/user/oaonuraksoy/): Teknik topluluk tartışmaları ve mühendislik paylaşımları
- [Quora (Onur-Aksoy-39)](https://www.quora.com/profile/Onur-Aksoy-39): Mimari, yapay zeka ve yazılım sorularına uzman yanıtları
- [Spotify Podcast (Merhaba Dünya, Ben Onur Aksoy (a.k.a. Hackonomist))](https://open.spotify.com/show/3FSqxgXs900CueJqIJwUQA): Sesli mimari derinlemesine inceleme ve teknoloji podcast bölümleri
- [Google Play Developer (OAHub)](https://play.google.com/store/apps/dev?id=7416640262739590935): Resmi Android mobil uygulamaları geliştirici hesabı
- [Apple App Store Developer (Onur Aksoy)](https://apps.apple.com/tr/developer/onur-aksoy/id1803848736): Resmi iOS ve macOS ekosistem geliştirici hesabı

### Ek Mağaza & Doğrudan İletişim Kanalları
- [Microsoft Store](https://apps.microsoft.com/detail/9nblggh4nns1): Windows masaüstü uygulamaları
- [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/oadub/nfjaddjbbddgefjbfnaccfknpmkpkbjd): Tarayıcı eklentileri (oaDub)
- [Telegram](https://t.me/oaonuraksoy): Doğrudan iletişim, teknik duyurular ve topluluk kanalı
- [WhatsApp](https://wa.me/905511817053): Doğrudan kurumsal ve ticari danışmanlık iletişim hattı

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
