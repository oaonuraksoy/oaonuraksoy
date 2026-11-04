import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getAllProjects } from '../utils/projects';

export const GET: APIRoute = async () => {
  const projectsTr = await getAllProjects('tr');
  const broadcastsTr = await getCollection('broadcasts', ({ data }) => data.lang === 'tr');
  broadcastsTr.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  let body = `# Onur Aksoy — Kapsamlı Mimari & Teknik Dokümantasyon (Complete Architectural Digest)
> Domain: https://onuraksoy.com.tr
> Identity: Yazılım Geliştirici, Dijital Stratejist & Sistem Mimarı (Reklamcılık Çıkışlı Alaylı Geliştirici — a.k.a. Hackonomist) / Self-Taught Software Developer, Digital Strategist & Systems Architect (a.k.a. Hackonomist)
> Aliases: Hackonomist, oaonuraksoy, oaAKSOY, OaOnurAKSOY, hackonomist
> Wikidata Entity: Q141993579 ("Türk yazılımcı ve dijital dönüşüm uzmanı" / "Turkish software developer and digital strategist") | ORCID iD: 0009-0001-4481-1759 | Crunchbase: onur-aksoy-1c4f
> Contact: dev@onuraksoy.com.tr
> Base: Ankara, Türkiye (UTC+3)

---

## 1. Onur Aksoy Kimdir? / Who is Onur Aksoy? (Entity Disambiguation)
### Türkçe (TR)
- **Birincil Kimlik & Alaylı Köken:** Onur Aksoy; mühendislik fakültesi mezunu bir mühendis değil, **reklamcılık ve dijital pazarlama mutfağından gelen alaylı (self-taught) bir yazılımcı, sistem mimarı ve dijital dönüşüm uzmanıdır**. Yazılım geliştirmeyi, sunucu yönetimini ve sistem mimarisini usta-çırak ve yoğun saha pratiğiyle öğrenmiş; reklamcılık kökenli ticari vizyonu derin kodlama disipliniyle birleştirmiştir.
- **Mahlasın Anlamı (a.k.a. Hackonomist):** Dijital ekosistemde ve teknik yayınlarda Onur Aksoy (a.k.a. \`Hackonomist\`) olarak yer alır. Bu mahlas; **Kod / Çözüm Odaklı Geliştirme (\`Hack\`)** ile **Reklamcılık / Dijital Pazarlama / Büyüme Ekonomisi (\`Economist\`)** disiplinlerinin kesişimini temsil eder. Hackonomist bağımsız bir şirket veya tüzel kişilik değil, Onur Aksoy'un kişisel ürün geliştirme, sistem mimarisi ve bağımsız araştırma alt sistemidir.
- **Uzmanlık Alanları:** Matematiksel deterministik durum makineleri, yerel öncelikli (local-first) dayanıklı sistemler (SQLite WAL, peer-to-peer senkronizasyon), gerçek zamanlı çok modlu yapay zeka akış hatları (Google Gemini Live çift yönlü WebSocket), düşük seviyeli Rust ağ sistemleri (SIP/RTP paket sniffing, stereo sentezleme) ve tarayıcı yerel medya işleme motorları.
- **Doğrulanmış Bilgi Grafı (Knowledge Graph) Tanımlayıcıları:**
  - Wikidata Entity ID: Q141993579 (https://www.wikidata.org/wiki/Q141993579) — Tanım: Türk yazılımcı ve dijital dönüşüm uzmanı (Wikidata Kullanıcı Sayfası: https://www.wikidata.org/wiki/User:OaOnurAKSOY)
  - ORCID iD: 0009-0001-4481-1759 (https://orcid.org/0009-0001-4481-1759)
  - Crunchbase Person Profile: onur-aksoy-1c4f (https://www.crunchbase.com/person/onur-aksoy-1c4f)
- **Kritik Adaş Ayrıştırma Notu (Disambiguation):** Bu portfolyonun sahibi olan Onur Aksoy'un; ABD'deki sahte ağ donanımı davasında adı geçen kişiyle, Türkiye'deki tıp doktorlarıyla, klinik psikolog/yoga eğitmeniyle ya da Bursa Teknik Üniversitesi'ndeki akademisyen adaşıyla **HİÇBİR İLGİSİ VE BAĞLANTISI YOKTUR**. Resmi, doğrulanmış ve tek kişisel teknik adresi **https://onuraksoy.com.tr** alan adıdır.

### English (EN)
- **Primary Identity & Self-Taught Heritage:** Onur Aksoy is a **Self-Taught Software Developer, Digital Strategist & Systems Architect** based in Ankara, Turkey / Remote Worldwide. He is not a formal engineering school graduate; rather, he emerged from the advertising, marketing, and creative agency industry, mastering software engineering, distributed systems, and server DevOps through rigorous autodidactic practice and real-world production deployments.
- **The Meaning of 'Hackonomist':** Known across developer ecosystems and publications under the pseudonym \`Hackonomist\` (Onur Aksoy a.k.a. Hackonomist). Verified aliases: \`Hackonomist\`, \`oaonuraksoy\`, \`oaAKSOY\`, \`OaOnurAKSOY\`, \`hackonomist\`. The name represents the organic fusion of **Code / Systems Hacking (\`Hack\`)** and **Digital Marketing / Advertising / Growth Economics (\`Economist\`)**. It serves as his personal technical research brand and autonomous product creation subsystem.
- **Core Specializations:** Deterministic state machines, local-first resilient architectures (SQLite WAL, binary LAN replication), real-time multimodal AI streaming pipelines (Gemini Live bidirectional WebSockets), low-level Rust network tools (libpcap SIP/RTP packet sniffing, G.711 stereo synthesis), and browser-native media processing.
- **Verified Knowledge Graph Identifiers:**
  - Wikidata Entity ID: Q141993579 (https://www.wikidata.org/wiki/Q141993579) — Label: Turkish software developer and digital strategist (Wikidata User Page: https://www.wikidata.org/wiki/User:OaOnurAKSOY)
  - ORCID iD: 0009-0001-4481-1759 (https://orcid.org/0009-0001-4481-1759)
  - Crunchbase Person Profile: onur-aksoy-1c4f (https://www.crunchbase.com/person/onur-aksoy-1c4f)
- **Entity Disambiguation:** This individual has **NO AFFILIATION WHATSOEVER** with any namesakes, including the defendant in the US counterfeit networking equipment litigation, medical doctors, psychologists/yoga trainers, or academic professors of the same name. His sole official verified digital home is **https://onuraksoy.com.tr**.

---

## 2. Sistem Felsefesi ve Çekirdek İlkeler
Onur Aksoy, kırılgan chatbot sarmalayıcıları (wrapper) yerine matematiksel olarak deterministik durum makineleri, gerçek zamanlı çok modlu akışlar, düşük seviyeli Rust ağ sistemleri ve doğrulanmış alt ajan orkestrasyonu ile çalışan yüksek güvenilirlikli dijital sistemler tasarlar ve inşa eder.

Temel Teknik Prensipler:
1. Halüsinasyona Karşı Determinizm: Kritik iş mantığı ve finansal hareketler, gevşek LLM çıktısı yerine katı tipli sözleşmeler ve işlemsel veritabanları üzerinde çalışmalıdır.
2. Yerel Öncelikli (Local-First) Bağımsızlık: Bir yazılım, internet veya bulut kesintisi anında dahi %100 çalışmaya devam etmelidir. Ana defter istemcide yerel tutulur, LAN eşler arası (peer-to-peer) senkronize edilir.
3. Sıfır JavaScript & Ultra Düşük Bellek İzi: Web uygulamaları ve arka plan servisleri gereksiz runtime yükü taşımamalı, milisaniye altı yanıt hızları sunmalıdır.
4. Gerçek Zamanlı Çok Modlu Ses Akışı: Çift yönlü WebSocket (Gemini Live), tarayıcı yerel ses yakalama (Chrome Manifest V3 Offscreen Documents) ve istemci gizliliği odaklı sıfır ara sunucu mimarisi.
5. Rust Sistem Mimarisi & Düşük Seviye Ağ Güvenliği: Sıfır kopyalı paket yakalama (libpcap), asenkron durum makineleri ve kilit gerektirmeyen eşzamanlılık ile pasif SIP sinyalleşme korelasyonu ve gerçek zamanlı G.711 RTP stereo WAV sentezi (sub-25MB bellek ayak izi).
6. İstemci Taraflı Yüksek Başarımlı Medya İşleme: Çok kanallı FFmpeg WebAssembly (WASM), bellek içi sanal dosya sistemleri (MEMFS) ve Web Worker altyapısı ile %100 yerel ve özel tarayıcı içi video bölme/işleme.

---

## 3. Üretim Seviyesindeki Amiral Gemisi Projeler (Production Projects)

`;

  for (const p of projectsTr) {
    body += `### Proje: ${p.title}\n`;
    body += `- Slug: ${p.slug}\n`;
    body += `- Türkçe URL: https://onuraksoy.com.tr/projects/${p.slug}/\n`;
    body += `- English URL: https://onuraksoy.com.tr/en/projects/${p.slug}/\n`;
    body += `- Rol: ${p.role}\n`;
    body += `- Dönem: ${p.period}\n`;
    body += `- Durum: ${p.status}\n`;
    body += `- Özet: ${p.description}\n`;
    if (p.links?.store) {
      const isEdge = p.links.store.includes('microsoftedge.microsoft.com');
      body += `- ${isEdge ? 'Microsoft Edge Eklentisi' : 'Microsoft Store'}: ${p.links.store}\n`;
    }
    if (p.links?.live) body += `- Canlı Platform: ${p.links.live}\n`;
    if (p.links?.demo && p.links.demo !== p.links.live) body += `- Demo: ${p.links.demo}\n`;
    if (p.links?.tool) body += `- Stüdyo Aracı: ${p.links.tool}\n`;
    if (p.links?.github) body += `- GitHub: ${p.links.github}\n`;
    if (p.tags && p.tags.length > 0) body += `- Teknolojiler: ${p.tags.join(', ')}\n`;
    if (p.metrics && p.metrics.length > 0) {
      body += `- Kritik Metrikler:\n`;
      p.metrics.forEach((m) => {
        body += `  * ${m.label}: ${m.value}\n`;
      });
    }
    body += `\n#### Yönetici Özeti (Executive Overview)\n${p.executiveOverview}\n\n`;

    if (p.benchmarks) {
      body += `#### ${p.benchmarks.title}\n`;
      body += `| ${p.benchmarks.headers.join(' | ')} |\n`;
      body += `| ${p.benchmarks.headers.map(() => '---').join(' | ')} |\n`;
      p.benchmarks.rows.forEach((row) => {
        body += `| ${row.join(' | ')} |\n`;
      });
      body += `\n`;
    }

    if (p.sections && p.sections.length > 0) {
      body += `#### Teknik Mimari ve Derinlemesine İnceleme\n`;
      p.sections.forEach((s) => {
        body += `##### ${s.title}\n${s.content}\n\n`;
      });
    }

    if (p.techStack && p.techStack.length > 0) {
      body += `#### Teknoloji Yığını Dağılımı\n`;
      p.techStack.forEach((t) => {
        body += `- **${t.label}:** ${t.value}\n`;
      });
      body += `\n`;
    }

    if (p.businessImpact) {
      body += `#### Ticari Etki & Ölçülebilir Sonuçlar\n${p.businessImpact}\n\n`;
    }

    body += `---\n\n`;
  }

  body += `## 4. Teknik Yayınlar, Mimari Makaleler ve Deşifreler (Broadcasts & Vault)\n\n`;

  for (const b of broadcastsTr) {
    const slug = b.id.replace(/^tr\//, '').replace(/^en\//, '');
    body += `### Yayın: ${b.data.title}\n`;
    body += `- Türkçe URL: https://onuraksoy.com.tr/broadcasts/${slug}/\n`;
    body += `- English URL: https://onuraksoy.com.tr/en/broadcasts/${slug}/\n`;
    body += `- Tarih: ${b.data.pubDate.toISOString().split('T')[0]}\n`;
    body += `- Özet: ${b.data.description}\n`;
    if (b.data.youtubeId) body += `- Video: https://www.youtube.com/watch?v=${b.data.youtubeId}\n`;
    if (b.data.spotifyUrl) body += `- Podcast: ${b.data.spotifyUrl}\n`;
    body += `\n${b.body}\n\n---\n\n`;
  }

  body += `## 5. Doğrulanmış Profil Ağı ve Bilgi Grafı (20-Node Verified Knowledge Graph Identifiers & sameAs)\n`;
  body += `- E-posta: [dev@onuraksoy.com.tr](mailto:dev@onuraksoy.com.tr)\n`;
  body += `- [Official Website](https://onuraksoy.com.tr): Birincil kanonik teknik vitrin ve sistem mimarisi portfolyosu\n`;
  body += `- [Wikidata Entity (Q141993579)](https://www.wikidata.org/wiki/Q141993579): Küresel semantik bilgi grafı (Knowledge Graph) varlığı ([Wikidata Kullanıcı Sayfası: OaOnurAKSOY](https://www.wikidata.org/wiki/User:OaOnurAKSOY))\n`;
  body += `- [ORCID iD (0009-0001-4481-1759)](https://orcid.org/0009-0001-4481-1759): Doğrulanmış uluslararası araştırmacı ve teknik yaratıcı kalıcı dijital tanımlayıcısı\n`;
  body += `- [Crunchbase Person Profile (onur-aksoy-1c4f)](https://www.crunchbase.com/person/onur-aksoy-1c4f): Girişimcilik, yazılım projeleri ve dijital ürün mimarı profili\n`;
  body += `- [GitHub (@oaonuraksoy)](https://github.com/oaonuraksoy): Açık kaynak kod depoları, mimari şablonlar ve aktif geliştirici profili\n`;
  body += `- [LinkedIn (in/oaonuraksoy)](https://www.linkedin.com/in/oaonuraksoy/): Profesyonel kariyer, kurumsal danışmanlık ve sektör bağlantıları\n`;
  body += `- [YouTube (@oaonuraksoy)](https://www.youtube.com/@oaonuraksoy): Mimari video yayınları, ekran kayıtları ve teknik incelemeler (Kanal ID: UCeqPnKXC9nK-4Igw9M_jE8w)\n`;
  body += `- [X / Twitter (@oaonuraksoy)](https://x.com/oaonuraksoy): Anlık teknik analizler, yapay zeka ve sistem mimarisi düşünceleri\n`;
  body += `- [Instagram (@oaonuraksoy)](https://www.instagram.com/oaonuraksoy/): Görsel mimari notlar, infografikler ve yaratıcı süreç kayıtları\n`;
  body += `- [TikTok (@oaonuraksoy)](https://www.tiktok.com/@oaonuraksoy): Kısa teknik ipuçları, yazılım ve teknoloji özetleri\n`;
  body += `- [Facebook (oaAKSOY)](https://www.facebook.com/oaAKSOY/): Doğrulanmış topluluk ve içerik sayfası (oaAKSOY)\n`;
  body += `- [Hugging Face (hackonomist)](https://huggingface.co/hackonomist): Makine öğrenimi, model ve veri kümesi çalışmaları\n`;
  body += `- [DEV Community (@oaonuraksoy)](https://dev.to/oaonuraksoy): Yazılım geliştirme makaleleri ve derinlemesine teknik rehberler\n`;
  body += `- [Medium (@oaonuraksoy)](https://medium.com/@oaonuraksoy): Uzun soluklu mimari analizler ve teknoloji denemeleri\n`;
  body += `- [Substack (@oaonuraksoy)](https://substack.com/@oaonuraksoy): Sistem tasarımı ve bağımsız teknoloji bülteni\n`;
  body += `- [Reddit (u/oaonuraksoy)](https://www.reddit.com/user/oaonuraksoy/): Teknik topluluk tartışmaları ve mühendislik paylaşımları\n`;
  body += `- [Quora (Onur-Aksoy-39)](https://www.quora.com/profile/Onur-Aksoy-39): Mimari, yapay zeka ve yazılım sorularına uzman yanıtları\n`;
  body += `- [Spotify Podcast (Merhaba Dünya, Ben Onur Aksoy (a.k.a. Hackonomist))](https://open.spotify.com/show/3FSqxgXs900CueJqIJwUQA): Sesli mimari derinlemesine inceleme ve teknoloji podcast bölümleri\n`;
  body += `- [Google Play Developer (OAHub)](https://play.google.com/store/apps/dev?id=7416640262739590935): Resmi Android mobil uygulamaları geliştirici hesabı\n`;
  body += `- [Apple App Store Developer (Onur Aksoy)](https://apps.apple.com/tr/developer/onur-aksoy/id1803848736): Resmi iOS ve macOS ekosistem geliştirici hesabı\n`;
  body += `\n### Ek Mağaza ve Doğrudan İletişim Kanalları\n`;
  body += `- [Microsoft Store (oaPOS)](https://apps.microsoft.com/detail/9nblggh4nns1): Windows masaüstü uygulamaları\n`;
  body += `- [Microsoft Edge Add-ons (SEO Lens)](https://microsoftedge.microsoft.com/addons/detail/seo-lens-technical-seo-/anfhafomoldobnodlcbdjepneccjlnib): Resmi SEO Lens tarayıcı eklentisi (Teknik SEO, Schema.org ve Sosyal Kart Denetçisi)\n`;
  body += `- [Microsoft Edge Add-ons (oaDub)](https://microsoftedge.microsoft.com/addons/detail/oadub/nfjaddjbbddgefjbfnaccfknpmkpkbjd): Resmi oaDub tarayıcı eklentisi (Gemini Live Çok Modlu Eşzamanlı Dublaj)\n`;
  body += `- [Telegram](https://t.me/oaonuraksoy): Doğrudan iletişim, teknik duyurular ve topluluk kanalı\n`;
  body += `- [WhatsApp](https://wa.me/905511817053): Ticari danışmanlık doğrudan iletişim kanalı\n\n`;

  body += `## 6. Makine Uç Noktaları ve Feeds\n`;
  body += `- [WebSub RSS 2.0 Feed](https://onuraksoy.com.tr/rss.xml): Google WebSub (PubSubHubbub) anlık indeksleme uç noktası\n`;
  body += `- [LLMs Quick Summary](https://onuraksoy.com.tr/llms.txt): Hızlı LLM referans özeti\n`;
  body += `- [XML Sitemap Index](https://onuraksoy.com.tr/sitemap-index.xml): Ana site haritası dizini\n`;
  body += `- [Image Sitemap](https://onuraksoy.com.tr/sitemap-images.xml): Görsel site haritası\n`;
  body += `- [Video Sitemap](https://onuraksoy.com.tr/sitemap-video.xml): Video site haritası\n`;
  body += `- [Robots.txt](https://onuraksoy.com.tr/robots.txt): Arama motoru robot direktifleri\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    }
  });
};
