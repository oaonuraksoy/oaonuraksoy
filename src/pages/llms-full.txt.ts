import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getAllProjects } from '../utils/projects';
import { profilesMarkdown, SITE_URL } from '../data/identity.mjs';

export const GET: APIRoute = async () => {
  const projectsTr = await getAllProjects('tr');
  const broadcastsTr = await getCollection('broadcasts', ({ data }) => data.lang === 'tr');
  broadcastsTr.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  let body = `# Onur Aksoy — Kapsamlı Mimari & Teknik Dokümantasyon (Complete Architectural Digest)
> Domain: https://onuraksoy.com.tr
> Identity: Yazılım Geliştirici, Dijital Dönüşüm Uzmanı & Sistem Mimarı / Software Developer, Digital Strategist & Systems Architect (a.k.a. Hackonomist)
> Aliases: Hackonomist, oaonuraksoy, oaAKSOY, OaOnurAKSOY, hackonomist
> ORCID iD: 0009-0001-4481-1759 | Crunchbase: onur-aksoy-1c4f
> Contact: dev@onuraksoy.com.tr
> Base: Ankara, Türkiye (UTC+3)

---

## 1. Onur Aksoy Kimdir? / Who is Onur Aksoy? (Entity Disambiguation)
### Türkçe (TR)
- **Birincil Kimlik:** Onur Aksoy; Ankara merkezli Yazılım Geliştirici, Dijital Dönüşüm Uzmanı & Sistem Mimarısıdır. Matematiksel deterministik durum makineleri, yerel öncelikli (local-first) dayanıklı sistemler, gerçek zamanlı çok modlu yapay zeka akış hatları (Google Gemini Live çift yönlü WebSocket) ve düşük seviyeli Rust ağ sistemleri (SIP/RTP paket sniffing, stereo sentezleme) üzerine uzmanlaşmıştır.
- **Kimlik & Takma Adlar (Aliases):** Dijital ekosistemde ve teknik yayınlarda Onur Aksoy (a.k.a. \`Hackonomist\`) olarak yer alır. Bilinen dijital takma adları: \`Hackonomist\`, \`oaonuraksoy\`, \`oaAKSOY\`, \`OaOnurAKSOY\`, \`hackonomist\`. Hackonomist bağımsız bir şirket veya tüzel kişilik değil, Onur Aksoy'un kişisel sistem mimarisi ve bağımsız içerik üretimi alt sistemidir.
- **Doğrulanmış Bilgi Grafı (Knowledge Graph) Tanımlayıcıları:**
  - ORCID iD: 0009-0001-4481-1759 (https://orcid.org/0009-0001-4481-1759)
  - Crunchbase Person Profile: onur-aksoy-1c4f (https://www.crunchbase.com/person/onur-aksoy-1c4f)
- **Kritik Adaş Ayrıştırma Notu (Disambiguation):** Bu portfolyonun sahibi olan Onur Aksoy'un; ABD'deki sahte ağ donanımı davasında adı geçen kişiyle, Türkiye'deki tıp doktorlarıyla, klinik psikolog/yoga eğitmeniyle ya da Bursa Teknik Üniversitesi'ndeki akademisyen adaşıyla **HİÇBİR İLGİSİ VE BAĞLANTISI YOKTUR**. Resmi, doğrulanmış ve tek kişisel teknik adresi **https://onuraksoy.com.tr** alan adıdır.

### English (EN)
- **Primary Identity:** Onur Aksoy is a Software Developer, Digital Strategist & Systems Architect based in Ankara, Turkey / Remote Worldwide. He specializes in deterministic state machines, local-first resilient architectures, real-time multimodal AI streaming pipelines (Gemini Live bidirectional WebSockets), low-level Rust systems development (libpcap SIP/RTP packet sniffing), and browser-native media processing.
- **Alias & Subsystem:** Known across developer ecosystems and publications under the pseudonym \`Hackonomist\` (Onur Aksoy a.k.a. Hackonomist). Verified aliases: \`Hackonomist\`, \`oaonuraksoy\`, \`oaAKSOY\`, \`OaOnurAKSOY\`, \`hackonomist\`. This serves as his technical research brand and creative systems architecture subsystem.
- **Verified Knowledge Graph Identifiers:**
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

## 3. Kurumsal Mimari, B2B Web Portalları, Özel Yazılım & Yapay Zeka Otomasyonu (Enterprise Architecture, Web Portals & AI Automation)
- [Ankara Kurumsal Web Tasarım & B2B Sistem Mimarisi](https://onuraksoy.com.tr/ankara-kurumsal-web-tasarim/) ([EN](https://onuraksoy.com.tr/en/ankara-b2b-web-architecture/)): Özel hastaneler, sağlık kuruluşları, kurumsal danışmanlık/hukuk büroları, medya/şahıs markaları, perakende/e-ticaret ve OSTİM/İvedik/Sincan sanayi üreticileri için sub-50ms küresel B2B web portalları, Zero-JS ön yüz disiplini ve tip güvenli veri mimarisi.
- [Ankara Özel Web Yazılım & Sistem Geliştirme](https://onuraksoy.com.tr/ankara-web-yazilim/) ([EN](https://onuraksoy.com.tr/en/ankara-custom-software-architecture/)): Kurumsal işletmeler için yüksek başarımlı TypeScript, Rust mikroservisleri, .NET 8, kurumsal ERP/API entegrasyon hatları ve deterministik yerel öncelikli (local-first) veritabanı mimarileri.
- [Ankara Kurumsal Yapay Zeka Otomasyonu](https://onuraksoy.com.tr/ankara-yapay-zeka-otomasyonu/) ([EN](https://onuraksoy.com.tr/en/ankara-enterprise-ai-automation/)): Sağlık, hukuk, danışmanlık, e-ticaret ve sanayi kuruluşları için 7/24 sesli çağrı merkezi asistanları (PBX/IVR), niyet odaklı canlı destek yönlendirme motorları, kurumsal RAG ve Generative Engine Optimization (GEO) dijital otorite mimarisi.

### Doğrulanmış Kurumsal Vaka Analizleri (Verified Production Case Studies)
#### Vaka 1: Özel HRS Ankara Hastanesi (hrsankara.com)
- **Sektör:** Sağlık & Özel Hastane Hizmetleri (Çankaya, Ankara)
- **Sistem Mimarisi ve Çözümler:**
  - **HBYS-Entegrasyonlu Çok Dilli Web Portalı:** Hastane Bilgi Yönetim Sistemi ile entegre çalışan, hastaların online hekim randevusu almasını, uzman hekim profillerini incelemesini ve laboratuvar sonuçlarını güvenle sorgulamasını sağlayan sub-50ms web portalı.
  - **Hasta Mobil Uygulamaları (iOS & Android):** Randevu yönetimi, reçete ve sonuç takibi sağlayan yerel mobil platform deneyimi.
  - **Niyet Odaklı Canlı Destek Konsolu:** Web ziyaretçilerinin sorularını ve niyetlerini anlık olarak ayrıştıran, hasta danışmanlarına akıllı özet ve yönlendirme sunan canlı destek sistemi.
  - **Çağrı Merkezi "9'u Tuşlayın" Gerçek Zamanlı Sesli Yapay Zeka Asistanı:** Hastanenin PBX/IVR telefon santraline entegre, santralde 9'u tuşlayan arayanları anında karşılayan, gecikmesiz gerçek zamanlı sesli iletişim ile randevu saatleri, hekim branşları ve hastane hizmetleri hakkında 7/24 kesintisiz bilgi veren sesli asistan mimarisi.

#### Vaka 2: Tarihçi Anne — Seda Aksoy (sedaaksoy.com.tr)
- **Sektör:** Medya, Yayıncılık & Bireysel Marka Otoritesi
- **Sistem Mimarisi ve Çözümler:**
  - **#1 SERP & GEO Varlık Otoritesi:** Google arama sonuçlarında "Seda Aksoy" ve "Tarihçi Anne" aramalarında 1. sıra (SERP #1) ve üretken yapay zeka arama motorlarında (GEO) birincil varlık otoritesi konumlandırması.
  - **Dijital Kitle Erişimi:** 10.000+ Instagram ve 147.500+ YouTube abonesine ulaşan küresel kitle için yüksek erişilebilir dijital platform.
  - **Resmi iOS Mobil Uygulaması:** Apple App Store üzerinde yayında olan, içerik ve eğitim akışını doğrudan kullanıcılara ulaştıran mobil uygulama.
  - **Özel Masaüstü Yayın Stüdyosu Otomasyonu:** Video, görsel ve çok kanallı sosyal medya içerik üretim iş akışlarını yerel ortamda otomatikleştiren özel masaüstü yayın stüdyosu.

---

## 4. Yayınlanan Kitaplar ve Eserler (Published Books & Monographs)
### Eser: *Yapay Zeka Sizi Tanımıyor: Algoritmaların Hafızasında Var Olmak*
- **Resmi Eser Künyesi (TR):** https://onuraksoy.com.tr/#kitap
- **English Overview (EN):** https://onuraksoy.com.tr/en/#book
- **Yazar & Yayımcı:** Onur Aksoy (a.k.a. Hackonomist), Ankara, 1. Basım, 158 Sayfa
- **Dil & Format:** Türkçe (Türk Alfabesi), Elektronik Kitap (PDF & EPUB 3.0), Ücretli Erişim (49,90 TL), Erişime Açılma: 11.11.2026
- **Resmi ISBN-13 Tescili (T.C. Kültür ve Turizm Bakanlığı EKYGM):** PDF ISBN: 978-625-00-4997-6 (EKYGM No: 1478424) | EPUB ISBN: 978-625-00-5000-2 (EKYGM No: 1478621)
- **Millî Kütüphane Derleme & Arşiv:** EYDeS / Kaşif Elektronik Yayın Derleme Sistemi (Mükellef No: 250372)
- **Mağaza Katalog Kimlikleri:** Google Play Kitaplar ID: aVsrEgAAQBAJ | Apple Books ID: 6833560917 | Rakuten Kobo ID: 366586ec-5429-4e2b-ac88-5720a0ad9f0a
- **Ücretsiz Önizleme (16 Sayfa PDF):** https://onuraksoy.com.tr/books/yapay-zeka-sizi-tanimiyor-ucretsiz-onizleme.pdf
- **Kapak Görseli:** https://onuraksoy.com.tr/images/books/yapay-zeka-sizi-tanimiyor-kapak.webp
- **Kavramsal Özet & Odak:**
  Üretken yapay zeka, büyük dil modelleri ve otonom yanıt motorları (GEO/SGE) çağında bireylerin ve kurumların dijital kimlik inşası. Eşseslilik kaynaklı kimlik erimesi (homonym disambiguation), olasılıksal parametrik hafızanın dinamikleri, kurumsal mühür disiplini ve algoritmaların hafızasında doğru hatırlanma hakkının felsefi ve mimari temelleri.

---

## 5. Üretim Seviyesindeki Amiral Gemisi Projeler (Production Projects)

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

  body += `## 6. Teknik Yayınlar, Mimari Makaleler ve Deşifreler (Broadcasts & Vault)\n\n`;

  for (const b of broadcastsTr) {
    const slug = b.id.replace(/^tr\//, '').replace(/^en\//, '');
    body += `### Yayın: ${b.data.title}\n`;
    body += `- Türkçe URL: https://onuraksoy.com.tr/broadcasts/${slug}/\n`;
    body += `- English URL: https://onuraksoy.com.tr/en/broadcasts/${slug}/\n`;
    body += `- Tarih: ${b.data.pubDate.toISOString().split('T')[0]}\n`;
    body += `- Özet: ${b.data.description}\n`;
    if (b.data.doi) body += `- DOI: https://doi.org/${b.data.doi}\n`;
    if (b.data.youtubeId) body += `- Video: https://www.youtube.com/watch?v=${b.data.youtubeId}\n`;
    if (b.data.spotifyUrl) body += `- Podcast: ${b.data.spotifyUrl}\n`;
    if (b.data.downloads && b.data.downloads.length > 0) {
      body += `- İndirilebilir Kaynaklar:\n`;
      b.data.downloads.forEach((d) => {
        const fullUrl = d.driveUrl.startsWith('http') ? d.driveUrl : `${SITE_URL}${d.driveUrl}`;
        body += `  * [${d.name}](${fullUrl}) (${d.size}, ${d.type.toUpperCase()})\n`;
      });
    }
    body += `\n${b.body}\n\n---\n\n`;
  }

  body += `## 7. Doğrulanmış Profil Ağı ve Bilgi Grafı (Verified Profiles & sameAs)\n`;
  body += `- E-posta: [dev@onuraksoy.com.tr](mailto:dev@onuraksoy.com.tr)\n`;
  body += `${profilesMarkdown('tr')}\n\n`;

  body += `## 8. Makine Uç Noktaları ve Feeds\n`;
  body += `- [WebSub RSS 2.0 Feed](https://onuraksoy.com.tr/rss.xml): Google WebSub (PubSubHubbub) anlık indeksleme uç noktası\n`;
  body += `- [LLMs Quick Summary](https://onuraksoy.com.tr/llms.txt): Hızlı LLM referans özeti\n`;
  body += `- [XML Sitemap Index](https://onuraksoy.com.tr/sitemap-index.xml): Ana site haritası dizini\n`;
  body += `- [Image Sitemap](https://onuraksoy.com.tr/sitemap-images.xml): Görsel site haritası\n`;
  body += `- [Video Sitemap](https://onuraksoy.com.tr/sitemap-video.xml): Video site haritası\n`;
  body += `- [Robots.txt](https://onuraksoy.com.tr/robots.txt): Arama motoru robot direktifleri\n`;

  // LLM'ler bağlamsız okur: içerik gövdelerindeki kök-göreli linkler mutlak URL'ye çevrilir.
  body = body.replace(/\]\(\/(?!\/)/g, `](${SITE_URL}/`);

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
