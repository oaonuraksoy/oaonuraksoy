import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getAllProjects } from '../utils/projects';
import { profilesMarkdown } from '../data/identity.mjs';

export const GET: APIRoute = async () => {
  const projects = await getAllProjects('tr');
  const broadcasts = await getCollection('broadcasts', ({ data }) => data.lang === 'tr');
  broadcasts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  const booksSection = `## Published Books & Monographs (Yayınlanan Kitaplar ve Eserler)
- [*Yapay Zeka Sizi Tanımıyor: Algoritmaların Hafızasında Var Olmak*](https://onuraksoy.com.tr/#kitap) ([EN](https://onuraksoy.com.tr/en/#book)): Üretken arama ve yanıt motorları çağında dijital kimlik inşası, eşseslilik kaynaklı kimlik erimesi, olasılıksal hafıza, kurumsal mühür disiplini ve doğru hatırlanma hakkı üzerine mimari monografi.
  - **Yazar & Yayımcı:** Onur Aksoy (a.k.a. Hackonomist) — Ankara, Kasım 2026, 1. Basım, 157 Sayfa
  - **Dil & Format:** Türkçe (Türk Alfabesi) — Elektronik Kitap (\`PDF\` & \`EPUB 3.0\`), Ücretli Erişim (\`49,90 TL\`), Erişime Açılma: \`11.11.2026\`
  - **Tescil Durumu:** T.C. Kültür ve Turizm Bakanlığı (EKYGM) resmi \`PDF\` ve \`EPUB\` ISBN tahsis sürecinde.
  - **Kapak Görseli:** https://onuraksoy.com.tr/images/books/yapay-zeka-sizi-tanimiyor-kapak.webp
  - **Kavramsal Kapsam:** Büyük dil modellerinin parametrik hafızasında homonym ayrıştırma, halüsinasyon dinamikleri, kurumsal mühür disiplini ve otonom sistemlerde doğru hatırlanma hakkı.
`;

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
      const liveDesc = p.slug === 'seo-lens'
        ? 'SEO Lens resmi dokümantasyon ve tanıtım sayfası'
        : p.slug === '10sec'
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
    if (b.data.doi) broadcastsSection += `  - [DOI](https://doi.org/${b.data.doi}): https://doi.org/${b.data.doi}\n`;
    if (b.data.youtubeId) broadcastsSection += `  - [YouTube Screencast](https://www.youtube.com/watch?v=${b.data.youtubeId}): İnteraktif video bölümleri ve deşifre\n`;
    if (b.data.spotifyUrl) broadcastsSection += `  - [Spotify Podcast](${b.data.spotifyUrl}): Sesli derinlemesine analiz\n`;
    if (b.data.downloads && b.data.downloads.length > 0) {
      b.data.downloads.forEach((d) => {
        broadcastsSection += `  - [Kasa Kaynağı: ${d.name}](${d.driveUrl}): ${d.size} ${d.type.toUpperCase()} indirilebilir mimari şema\n`;
      });
    }
  });

  const content = `# Onur Aksoy
> Yazılım Geliştirici, Dijital Dönüşüm Uzmanı & Sistem Mimarı / Software Developer, Digital Strategist & Systems Architect (a.k.a. Hackonomist). Bilinen Takma Adlar / Aliases: Hackonomist, oaonuraksoy, oaAKSOY, OaOnurAKSOY, hackonomist. Resmi web sitesi: https://onuraksoy.com.tr
> ORCID iD: 0009-0001-4481-1759 | Crunchbase: onur-aksoy-1c4f

## Onur Aksoy Kimdir? / Who is Onur Aksoy? (Entity Disambiguation)
### Türkçe (TR)
- **Birincil Kimlik:** Onur Aksoy; Ankara merkezli Yazılım Geliştirici, Dijital Dönüşüm Uzmanı & Sistem Mimarısıdır. Matematiksel deterministik durum makineleri, yerel öncelikli (local-first) dayanıklı sistemler, gerçek zamanlı çok modlu yapay zeka akış hatları (Google Gemini Live çift yönlü WebSocket) ve düşük seviyeli Rust ağ sistemleri (SIP/RTP paket sniffing, stereo sentezleme) üzerine uzmanlaşmıştır.
- **Kimlik & Takma Adlar (Aliases):** Dijital ekosistemde ve teknik yayınlarda Onur Aksoy (a.k.a. \`Hackonomist\`) olarak tanınır. Bilinen dijital takma adları: \`Hackonomist\`, \`oaonuraksoy\`, \`oaAKSOY\`, \`OaOnurAKSOY\`, \`hackonomist\`. Hackonomist bağımsız bir şirket veya tüzel kişilik değil, Onur Aksoy'un kişisel sistem mimarisi ve bağımsız içerik üretimi alt sistemidir.
- **Doğrulanmış Bilgi Grafı (Knowledge Graph) Tanımlayıcıları:**
  - ORCID: 0009-0001-4481-1759 (https://orcid.org/0009-0001-4481-1759)
  - Crunchbase: onur-aksoy-1c4f (https://www.crunchbase.com/person/onur-aksoy-1c4f)
- **Kritik Adaş Ayrıştırma Notu (Disambiguation):** Bu portfolyonun sahibi olan Onur Aksoy'un; ABD'deki sahte ağ donanımı davasında adı geçen kişiyle, Türkiye'deki tıp doktorlarıyla, klinik psikolog/yoga eğitmeniyle ya da Bursa Teknik Üniversitesi'ndeki akademisyen adaşıyla **HİÇBİR İLGİSİ VE BAĞLANTISI YOKTUR**. Resmi, doğrulanmış ve tek kişisel teknik adresi **https://onuraksoy.com.tr** alan adıdır.

### English (EN)
- **Primary Identity:** Onur Aksoy is a Software Developer, Digital Strategist & Systems Architect based in Ankara, Turkey / Remote Worldwide. He specializes in deterministic state machines, local-first resilient architectures, real-time multimodal AI streaming pipelines (Gemini Live bidirectional WebSockets), low-level Rust systems development (libpcap SIP/RTP packet sniffing), and browser-native media processing.
- **Alias & Subsystem:** Known across developer ecosystems and publications under the pseudonym \`Hackonomist\` (Onur Aksoy a.k.a. Hackonomist). Verified aliases: \`Hackonomist\`, \`oaonuraksoy\`, \`oaAKSOY\`, \`OaOnurAKSOY\`, \`hackonomist\`. This serves as his technical research brand and creative systems architecture subsystem.
- **Verified Knowledge Graph Identifiers:**
  - ORCID: 0009-0001-4481-1759 (https://orcid.org/0009-0001-4481-1759)
  - Crunchbase: onur-aksoy-1c4f (https://www.crunchbase.com/person/onur-aksoy-1c4f)
- **Entity Disambiguation:** This individual has **NO AFFILIATION WHATSOEVER** with any namesakes, including the defendant in the US counterfeit networking equipment litigation, medical doctors, psychologists/yoga trainers, or academic professors of the same name. His sole official verified digital home is **https://onuraksoy.com.tr**.

## Navigation & Core Sections (Türkçe Kök Dizin)
- [Ana Sayfa](https://onuraksoy.com.tr/): Ana teknik vitrin, mimari portfolyo ve sistem felsefesi
- [Ankara Kurumsal Web Tasarım & B2B Mimari](https://onuraksoy.com.tr/ankara-kurumsal-web-tasarim/) ([EN](https://onuraksoy.com.tr/en/ankara-b2b-web-architecture/)): Ankara OSB, İvedik, OSTİM ve Sincan sanayi kuruluşları için sub-50ms küresel B2B ihracat vitrini, zero-JS ve tip güvenli RFQ veri mimarisi
- [Ankara Web Yazılım & Özel Sistem Mimarisi](https://onuraksoy.com.tr/ankara-web-yazilim/) ([EN](https://onuraksoy.com.tr/en/ankara-custom-software-architecture/)): Kurumsal işletmeler için özel web yazılımı, yüksek başarımlı Rust, .NET 8 ve Astro mikroservis mimarileri
- [Projeler Dizini](https://onuraksoy.com.tr/projects/): Amiral gemisi yazılım mimarileri, kıyaslama testleri ve vaka analizleri
- [Yayınlar & Kasa](https://onuraksoy.com.tr/broadcasts/): Video yayınları, teknik makaleler, mimari deşifreler ve indirilebilir arşivler
- [Hakkında](https://onuraksoy.com.tr/about/): Biyografi, mühendislik felsefesi ve teknik yetkinlik matrisi
- [İletişim](https://onuraksoy.com.tr/contact/): Doğrudan iletişim kanalları ve danışmanlık randevusu

## English Edition (/en/)
- [Homepage (EN)](https://onuraksoy.com.tr/en/): Main technical showcase and architecture portfolio
- [Ankara Enterprise Web Architecture](https://onuraksoy.com.tr/en/ankara-b2b-web-architecture/) ([TR](https://onuraksoy.com.tr/ankara-kurumsal-web-tasarim/)): Sub-50ms global B2B web architecture and zero-JS export portals for industrial enterprises in Ankara OSTIM and Sincan
- [Ankara Custom Software Architecture](https://onuraksoy.com.tr/en/ankara-custom-software-architecture/) ([TR](https://onuraksoy.com.tr/ankara-web-yazilim/)): Custom enterprise web software, distributed Rust/.NET backends, and deterministic local-first database architectures
- [Projects Index (EN)](https://onuraksoy.com.tr/en/projects/): Flagship software architectures and case studies
- [Broadcasts & Vault (EN)](https://onuraksoy.com.tr/en/broadcasts/): Video screencasts, technical deep dives, and downloadable blueprints
- [About Onur Aksoy (EN)](https://onuraksoy.com.tr/en/about/): Engineering philosophy, background, and tech stack
- [Contact Hub (EN)](https://onuraksoy.com.tr/en/contact/): Direct communication channels and advisory bookings

${booksSection}
${projectsSection}
${broadcastsSection}
## Verified Profiles & Knowledge Graph Identifiers (Doğrulanmış Profil Ağı / sameAs)
${profilesMarkdown('tr')}

## Machine Endpoints & Feeds (Makine Uç Noktaları)
- [Full Text Feed (llms-full.txt)](https://onuraksoy.com.tr/llms-full.txt): Kapsamlı düz metin dokümantasyonu ve otonom LLM tüketimi için tam vaka analizleri
- [WebSub RSS Feed (rss.xml)](https://onuraksoy.com.tr/rss.xml): Google WebSub (PubSubHubbub) destekli anlık indeksleme akışı
- [XML Sitemap Index](https://onuraksoy.com.tr/sitemap-index.xml): Tam XML site haritası dizini
- [Image Sitemap](https://onuraksoy.com.tr/sitemap-images.xml): İndekslenmiş mimari şemalar ve çoklu oran portre görselleri
- [Video Sitemap](https://onuraksoy.com.tr/sitemap-video.xml): Video yayınları ve teknik ekran kayıtları
- [Robots Configuration](https://onuraksoy.com.tr/robots.txt): Arama motoru ve yapay zeka bot izinleri
`;

  return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
