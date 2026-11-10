---
title: "50ms Altı Küresel B2B Portallar Tasarlamak: Edge Önbellekleme ve Zero-JS Ön Yüz Mimarisi"
description: "Dünya genelinde 50 milisaniyenin altında açılan küresel B2B ihracat portalları için eksiksiz sistem mühendisliği rehberi: Astro statik derleme, Zero-JS ön yüz felsefesi, Cloudflare Tiered Cache önbellekleme ve 100/100 Core Web Vitals mimarisi."
seoTitle: "Kurumsal Web Sitesi Hızlandırma & Edge Mimari"
seoDescription: "Kurumsal web sitesi hızlandırma, Core Web Vitals 100/100 optimizasyonu ve 50ms altı küresel B2B ihracat portalları için Astro Zero-JS ve Edge rehberi."
pubDate: 2026-11-04
lang: "tr"
ref: "sub-50ms-global-b2b-portals-edge-zero-js"
doi: "10.5281/zenodo.24111422"
featured: true
tags: ["EdgeComputing", "ZeroJS", "AstroSSG", "B2BPortallari", "CoreWebVitals", "SistemMimarisi", "CloudflareEdge"]
duration: "PT18M45S"
thumbnail: "/images/broadcasts/sub-50ms-global-b2b-portals-edge-zero-js.webp"
chapters:
  - time: "00:00"
    title: "Giriş: 50 Milisaniye Sınırı ve Küresel Ticarette Hızın Gücü"
  - time: "02:45"
    title: "Mimari Temel 1: Astro Statik Derleme (SSG) ve HTML Önceliği"
  - time: "06:10"
    title: "Mimari Temel 2: Zero-JS Disiplini ve İstemci Hidrasyonunun Kaldırılması"
  - time: "09:35"
    title: "Mimari Temel 3: Cloudflare 330+ Anycast Edge ve Tiered Cache"
  - time: "12:50"
    title: "Mimari Temel 4: Kademeli Vektörel Tipografi ve Görsel Optimizasyonu"
  - time: "15:40"
    title: "Mimari Temel 5: Core Web Vitals 100/100 Skoru ve Küresel Karşılaştırma"
downloads:
  - name: "B2B Uluslararası İhracat RFQ Veri Sözleşmesi Şeması"
    size: "6.4 KB"
    type: "json"
    driveUrl: "/vault/b2b/b2b-export-rfq-schema.json"
    hash: "sha256:dcaf49c6608424158ce0578d62ab2e8a778cb1b781d7aeeba2c4c22a0756b5a2"
  - name: "2026 Kurumsal Siber Güvenlik Başlıkları & WAF Konfigürasyonu"
    size: "6.1 KB"
    type: "conf"
    driveUrl: "/vault/b2b/enterprise-security-headers-2026.conf"
    hash: "sha256:98e5f9e28e61ed1e76aa23d49a013969e130f215337e4cbcc4c1ba6c986ecbe9"
faqs:
  - question: "50 milisaniye (sub-50ms) sunucu yanıt süresi (TTFB) B2B ihracatta neden devrim yaratır?"
    answer: "Geleneksel web siteleri merkezi bir sunucuda barındırıldığında, Frankfurt'tan bağlanan bir satın almacı için ışık hızı ve ağ yönlendirmeleri nedeniyle en az 300-600ms, Tokyo veya Los Angeles'tan bağlanan bir alıcı içinse 1.2-2 saniye sunucu gecikmesi oluşur. Cloudflare Anycast Edge üzerinde çalışan ve statik derlenen bir portal, kullanıcının bulunduğu şehirdeki yerel edge sunucusundan hizmet verdiği için dünyanın neresinde olunursa olunsun sayfayı 50ms altında teslim eder. Bu hız, alıcıda sıfır sürtünme ve mutlak teknik güven yaratır."
  - question: "Zero-JS mimarisi nedir ve modern bir web sitesi hiç JavaScript kullanmadan nasıl interaktif olabilir?"
    answer: "Zero-JS disiplini, sitenin ilk render anında istemci tarayıcısına hiçbir gereksiz JavaScript framework'ü (React, Vue veya Angular çalışma zamanı) göndermeme prensibidir. Modern CSS yetenekleri (:has, :focus-within, details/summary), SVG filtreleri ve tarayıcı yerel form API'leri sayesinde menüler, sekmeler, modal pencereler ve form doğrulamaları sıfır JavaScript yükü ile çalışır. Gerekli olan mikro interaksiyonlar ise sayfayı kilitlemeyen saf vanilla inline scriptler veya minimal Web Component yapıları ile çözülür."
  - question: "Tiered Cache (Kademeli Önbellek) mimarisi edge sunucularda önbellek isabet oranını (Cache Hit Ratio) nasıl artırır?"
    answer: "Klasik CDN yapılarında her bir edge sunucusu içeriği ana sunucudan (origin) bağımsız çeker; bu da düşük trafikli B2B ihracat sayfalarında sık sık önbellek kaçırmalarına (cache miss) yol açar. Tiered Cache mimarisinde ise dünya genelindeki edge düğümleri bölgesel üst düzey veri merkezlerine (Upper-Tier Hubs) bağlanır. Frankfurt veya New York'taki bir edge sunucu bir sayfayı bir kez önbelleğe aldığında, çevre şehirlerdeki tüm diğer düğümler içeriği doğrudan bu bölgesel merkezden sub-10ms hızında çeker ve önbellek isabet oranı %98'in üzerine çıkar."
  - question: "Core Web Vitals metriklerinde 100/100 almak B2B arama sıralamalarını ve dönüşüm oranlarını nasıl etkiler?"
    answer: "Google'ın sayfa deneyimi sıralama sinyalleri; En Büyük İçerikli Boyama (LCP < 1.2s), Etkileşime Giriş Gecikmesi (INP < 50ms) ve Kümülatif Düzen Kayması (CLS = 0) metriklerini doğrudan ödüllendirir. Tüm bu metriklerin yeşil aralıkta (100/100) olması, sitenin uluslararası aramalarda rakiplerinin önüne geçmesini sağlarken, mobilde hemen çıkma oranlarını %60'tan %18 seviyelerine düşürerek teklif formlarının doldurulma oranını 3 kat artırır."
---

## Hız Bir Tercih Değil, En Güçlü İkna Aracıdır

Dijital dünyada çoğu şirket hız konusunu yalnızca bir teknik teferruat veya "tasarım bittikten sonra bakılacak bir cila" olarak görür. Oysa sistem mimarisi perspektifinden baktığımızda hız; **bir şirketin mühendislik yetkinliğini, işine duyduğu saygıyı ve operasyonel disiplinini kanıtlayan en somut vitrindir.**

Özellikle küresel pazara yüksek katma değerli ürünler ihraç eden bir üreticiyseniz; Almanya'daki bir mühendislik direktörü, İtalya'daki bir satın alma uzmanı veya ABD'deki bir tedarik zinciri yöneticisi sitenize girdiğinde sayfa anında karşısına çıkmalıdır. 3 saniye dönen beyaz ekranlar, yüklenirken zıplayan butonlar ve tarayıcıyı donduran JavaScript kütüphaneleri, potansiyel müşterinize bilinçaltında tek bir mesaj fısıldar: *"Biz henüz dijital altyapımızı bile verimli yönetemiyoruz."*

Kendi geliştirdiğim sistemlerde, [oaPOS](/projects/oapos/) ve [oaTeklif](/broadcasts/oateklif-ucretsiz-teklif-olusturucu/) gibi yüksek performanslı mimarilerde uyguladığım değişmez bir ilke vardır: **Gereksiz katmanları yok et, deterministik ol ve veriyi kullanıcıya en yakın noktada teslim et.**

Bu yayında; küresel ölçekte **50 milisaniyenin altında açılan** kurumsal B2B portallar inşa etmenin arkasındaki 5 mimari ayağı inceliyoruz.

```mermaid
flowchart LR
    Client["Küresel Alıcı<br/>(Berlin / Tokyo / Chicago)"] --> Anycast["Cloudflare Anycast DNS<br/>(< 12ms Çözümleme)"]
    Anycast --> EdgeNode["En Yakın Edge Düğümü<br/>(330+ Veri Merkezi • Tiered Cache)"]
    EdgeNode -->|%98.4 Cache Hit| BrowserCache["Saf Statik HTML + CSS + WebP<br/>(< 35ms TTFB • 0 KB JS Yükü)"]
    EdgeNode -.->|Nadir Cache Miss| OriginR2[("Cloudflare R2 / SSG Artifact Deposu<br/>(Sıfır Sunucu Soğuk Başlangıcı)")]
    BrowserCache --> PerfectPaint["LCP: 0.6s • CLS: 0.00 • INP: 18ms<br/>(100/100 Lighthouse Skoru)"]
```

---

## 50ms Altı Küresel B2B Mimarinin 5 Temel Ayağı

Dünya standartlarında bir dijital ihracat portalını mümkün kılan mühendislik prensipleri:

### 1. Astro Statik Derleme (SSG) ve HTML Önceliği
Geleneksel web sitelerinde her sayfa isteği geldiğinde sunucu uyanır, veritabanına bağlanır, şablonları birleştirir ve HTML üretir. Bu dinamik süreç tek başına 200-800 milisaniye gecikme ekler.

Modern mimaride bu hantallık reddedilir. [Ankara kurumsal web tasarım](/ankara-kurumsal-web-tasarim/) yaklaşımımızda olduğu gibi Astro SSG motoru; yüzlerce ürün sayfasını, teknik spesifikasyonları ve çoklu dil varyantlarını derleme (build) aşamasında bir kez hesaplar ve saf, sıkıştırılmış statik dosyalara dönüştürür. Kullanıcı siteye geldiğinde sunucunun "düşünmesine" gerek kalmaz; önceden hazırlanmış mükemmel HTML anında akıtılır.

### 2. Zero-JS Disiplini: Tarayıcıyı Kod Hamallığından Kurtarmak
Modern web geliştiriciliğinin en büyük hastalığı, 5 satırlık basit bir menü açma animasyonu için 2 megabaytlık React veya Vue kütüphanelerini tarayıcıya indirtmektir. Düşük işlemcili mobil cihazlarda bu kütüphanelerin çözümlenmesi (parse ve execute) 2-4 saniye sürer ve tarayıcıyı kilitler.

Zero-JS mimarisinde ana sayfa ve ürün katalogları **0 kilobayt harici JavaScript** ile çalışır.
- Açılır menüler ve filtreler CSS `:has()` ve `:focus-within` ile yönetilir.
- Sıkça sorulan sorular (SSS) semantik HTML `<details>` ve `<summary>` etiketleriyle sıfır script ile çözülür.
- Tüm görseller modern WebP/AVIF formatında doğru `width` ve `height` nitelikleriyle yerleştirilir, böylece sayfa yüklenirken layout kayması (CLS) sıfır olur.

### 3. Cloudflare 330+ Anycast Edge ve Tiered Cache Mimarisi
Bir web sitesini tek bir coğrafi sunucuya hapsetmek, uluslararası ihracat vizyonuyla çelişir. Siteniz Ankara'da barındırılıyorsa, Frankfurt'taki kullanıcı için gecikme 60ms iken, Houston'daki alıcı için 180ms, Sidney'deki alıcı için 350ms'dir.

Biz mimariyi Anycast Edge üzerinde kurgularız:
- Web varlıkları tek bir sunucuda değil, dünya genelindeki 330'dan fazla Cloudflare edge düğümünde aynı anda yaşar.
- **Tiered Cache (Kademeli Önbellek)** teknolojisiyle bölgesel üst merkezler (hub) tanımlanır. Bir içeriğin önbellek geçerliliği sona erse dahi istek Türkiye'ye gelmez; bölgesel hub üzerinden sub-10ms gecikmeyle yenilenir.
- Önbellek isabet oranı (Cache Hit Ratio) %98'in üzerine çıkar; bu da sitenin her an, dünyanın her noktasında ışık hızında açılmasını sağlar.

### 4. Kurumsal Tip Güvenliği ve Kasa İndirmeleri
Bir sanayi portalı yalnızca okunabilir metinlerden ibaret değildir; teknik şartnamelerin, CAD çizimlerinin ve teklif taleplerinin (RFQ) yönetildiği bir operasyon merkezidir.

The Vault üzerinde paylaştığım kaynaklar bu mimarinin pratik uygulamasını gösterir:
- [B2B Uluslararası İhracat RFQ Veri Sözleşmesi Şeması](/vault/b2b/b2b-export-rfq-schema.json): Satın alma taleplerinin istemci ve sunucu arasında tip güvenli JSON sözleşmeleriyle nasıl doğrulandığını tanımlar.
- [2026 Kurumsal Siber Güvenlik Başlıkları & WAF Konfigürasyonu](/vault/b2b/enterprise-security-headers-2026.conf): Edge seviyesinde katı CSP, HSTS Preload ve bot savunmasını devreye alan üretim kurallarını sunar.

### 5. 100/100 Core Web Vitals ve Sıfır Layout Kayması
Performans ölçülmeyen bir soyutluk değildir; Google'ın Core Web Vitals metrikleriyle matematiksel olarak test edilir. Kusursuz bir B2B portalın karnesi şu değerleri sağlamalıdır:

| Metrik | Anlamı | Geleneksel WordPress Sitesi | Zero-JS Edge SSG Mimarisi |
|---|---|---|---|
| **TTFB (Time to First Byte)** | Sunucudan ilk baytın gelme süresi | 650ms – 1.800ms | **< 35ms** |
| **FCP (First Contentful Paint)** | İlk metin/öğenin ekranda belirmesi | 1.8s – 3.2s | **< 0.4s** |
| **LCP (Largest Contentful Paint)** | Ana görselin/başlığın render olması | 3.5s – 6.5s | **< 0.8s** |
| **CLS (Cumulative Layout Shift)** | Sayfa yüklenirken öğelerin kayması | 0.18 – 0.45 (Bozuk) | **0.00 (Sıfır kayma)** |
| **INP (Interaction to Next Paint)** | Tıklama ve etkileşim gecikmesi | 180ms – 400ms | **< 20ms (Anında tepki)** |
| **Lighthouse Skoru** | Genel performans ve SEO puanı | 35 – 55 / 100 | **100 / 100 Tam Puan** |

---

## Küresel Alıcılar İçin Kusursuz İhracat Hattı

Uluslararası B2B pazarda rekabet eden sanayi ve teknoloji şirketleri için [Ankara web yazılım](/ankara-web-yazilim/) ve sistem mühendisliği çözümlerimiz; hantal ajans kalıplarını bir kenara bırakarak şu kazanımları sunar:

1. **Küresel Erişilebilirlik:** Şirketiniz dünyanın hangi ülkesinden ziyaret edilirse edilsin yerel bir süper bilgisayar hızında açılır.
2. **Sıfır Altyapı Bakımı:** Canlıda veritabanı veya PHP sunucusu çalışmadığı için sunucu çökmesi, bellek taşması veya veritabanı kilitlenmesi gibi kabuslar tarihe karışır.
3. **Maksimum Arama Otoritesi:** Kusursuz Core Web Vitals ve iki dilli statik hreflang mimarisi sayesinde hem geleneksel arama motorlarında hem de yapay zeka arama motorlarında fabrikanız en üst sıraya yerleşir.

Hız bir süs değil; küresel ticarette güveni inşa eden ve alıcıyı masaya oturtan en sessiz mühendislik gücüdür.
