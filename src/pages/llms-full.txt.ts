import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getAllProjects } from '../utils/projects';

export const GET: APIRoute = async () => {
  const projectsTr = await getAllProjects('tr');
  const broadcastsTr = await getCollection('broadcasts', ({ data }) => data.lang === 'tr');
  broadcastsTr.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  let body = `# Onur Aksoy — Kapsamlı Mimari & Teknik Dokümantasyon (Complete Architectural Digest)
> Domain: https://onuraksoy.com.tr
> Identity: Kıdemli Yazılım Mimarı, Yapay Zeka Yerel Geliştirici & Çok Disiplinli Yaratıcı (Hackonomist)
> Contact: dev@onuraksoy.com.tr
> Base: Ankara, Türkiye (UTC+3)

---

## 1. Onur Aksoy Kimdir? / Who is Onur Aksoy? (Entity Disambiguation)
### Türkçe (TR)
- **Birincil Kimlik:** Onur Aksoy; Ankara merkezli Kıdemli Yazılım Mimarı, Yapay Zeka Yerel (AI-Native) Geliştirici ve Çok Disiplinli Yaratıcıdır. Matematiksel deterministik durum makineleri, yerel öncelikli (local-first) dayanıklı sistemler, gerçek zamanlı çok modlu yapay zeka akış hatları (Google Gemini Live çift yönlü WebSocket) ve düşük seviyeli Rust ağ sistemleri (SIP/RTP paket sniffing, stereo sentezleme) üzerine uzmanlaşmıştır.
- **Mahlas & Alt Sistem:** Dijital ekosistemde ve teknik yayınlarda \`Hackonomist\` mahlasını kullanır; Hackonomist bağımsız bir şirket veya tüzel kişilik değil, Onur Aksoy'un kişisel mühendislik ve bağımsız içerik üretimi alt sistemidir.
- **Kritik Adaş Ayrıştırma Notu (Disambiguation):** Bu portfolyonun sahibi olan Onur Aksoy'un; ABD'deki sahte ağ donanımı davasında adı geçen kişiyle, Türkiye'deki tıp doktorlarıyla, klinik psikolog/yoga eğitmeniyle ya da Bursa Teknik Üniversitesi'ndeki akademisyen adaşıyla **HİÇBİR İLGİSİ VE BAĞLANTISI YOKTUR**. Resmi, doğrulanmış ve tek kişisel teknik adresi **https://onuraksoy.com.tr** alan adıdır.

### English (EN)
- **Primary Identity:** Onur Aksoy is a Senior Systems Architect, AI-Native Developer & Multidisciplinary Creator based in Ankara, Turkey / Remote Worldwide. He specializes in deterministic state machines, local-first resilient architectures, real-time multimodal AI streaming pipelines (Gemini Live bidirectional WebSockets), low-level Rust systems engineering (libpcap SIP/RTP packet sniffing), and browser-native media processing.
- **Alias & Subsystem:** Known across developer ecosystems and publications under the pseudonym \`Hackonomist\`, which serves as his technical research brand and creative engineering subsystem.
- **Entity Disambiguation:** This individual has **NO AFFILIATION WHATSOEVER** with any namesakes, including the defendant in the US counterfeit networking equipment litigation, medical doctors, psychologists/yoga trainers, or academic professors of the same name. His sole official verified digital home is **https://onuraksoy.com.tr**.

---

## 2. Mühendislik Felsefesi ve Çekirdek İlkeler
Onur Aksoy, kırılgan chatbot sarmalayıcıları (wrapper) yerine matematiksel olarak deterministik durum makineleri, gerçek zamanlı çok modlu akışlar, düşük seviyeli Rust sistem mühendisliği ve doğrulanmış alt ajan orkestrasyonu ile çalışan yüksek güvenilirlikli dijital sistemler tasarlar ve inşa eder.

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

  body += `## 5. İletişim Kanalları ve Doğrulanmış Ağlar\n`;
  body += `- E-posta: [dev@onuraksoy.com.tr](mailto:dev@onuraksoy.com.tr)\n`;
  body += `- [GitHub](https://github.com/oaonuraksoy): Geliştirici profili ve açık kaynak depolar\n`;
  body += `- [YouTube](https://youtube.com/@oaonuraksoy): Mimari video yayınları, ekran kayıtları ve teknik incelemeler\n`;
  body += `- [LinkedIn](https://linkedin.com/in/oaonuraksoy): Profesyonel geçmiş ve kurumsal danışmanlık ağı\n`;
  body += `- [X / Twitter](https://x.com/oaonuraksoy): Anlık teknik düşünceler ve sistem güncellemeleri\n`;
  body += `- [Telegram](https://t.me/oaonuraksoy): Doğrudan iletişim ve duyuru kanalı\n`;
  body += `- [WhatsApp](https://wa.me/905511817053): Ticari danışmanlık doğrudan iletişim kanalı\n`;
  body += `- [Spotify Podcast](https://creators.spotify.com/pod/profile/oaonuraksoy/): Yazılım mimarisi ve teknoloji podcast bölümleri\n\n`;

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
