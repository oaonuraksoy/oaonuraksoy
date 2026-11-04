---
title: "Kurumsal Web Sitelerinde 2026 Siber Güvenlik Standartları: Bilgi İşlem Ekipleri Nelere Bakmalı?"
description: "Kurumsal B2B ve sanayi şirketlerinin bilgi işlem (IT) ve siber güvenlik ekipleri için 2026 web güvenlik denetim rehberi: HSTS Preload zorunluluğu, katı CSP (İçerik Güvenlik Politikası), SSG izolasyonu ile sıfır saldırı yüzeyi, Permissions-Policy ve Cloudflare VIP WAF bot yönetimi."
seoTitle: "2026 Kurumsal Web Siber Güvenlik Standartları"
seoDescription: "Bilgi işlem ve satın alma ekipleri için 2026 kurumsal web güvenliği kontrol listesi: HSTS, CSP, güvenlik başlıkları ve KVKK/GDPR uyumu."
pubDate: 2026-11-03
lang: "tr"
ref: "kurumsal-web-siber-guvenlik-standartlari-2026"
featured: false
tags: ["SiberGuvenlik", "KurumsalWeb", "HSTSPreload", "ContentSecurityPolicy", "ZeroTrust", "CloudflareWAF", "DevSecOps"]
duration: "PT15M20S"
thumbnail: "/images/broadcasts/kurumsal-web-siber-guvenlik-standartlari-2026.webp"
chapters:
  - time: "00:00"
    title: "Giriş: Kurumsal Web Siteleri Neden Hedefte?"
  - time: "02:20"
    title: "Kriter 1: HSTS Preload ve 2 Yıllık Zorunlu Şifreleme"
  - time: "04:50"
    title: "Kriter 2: Strict CSP (Content Security Policy) ve XSS Savunması"
  - time: "07:30"
    title: "Kriter 3: SSG (Statik Site) Mimarisiyle Sıfır Saldırı Yüzeyi"
  - time: "10:10"
    title: "Kriter 4: Permissions-Policy ve Donanım İzolasyonu"
  - time: "12:40"
    title: "Kriter 5: Cloudflare WAF, VIP AI Arama Botları ve Kazıyıcı Yönetimi"
downloads:
  - name: "2026 Kurumsal Siber Güvenlik Başlıkları & WAF Konfigürasyonu"
    size: "6.1 KB"
    type: "conf"
    driveUrl: "/vault/b2b/enterprise-security-headers-2026.conf"
    hash: "sha256:98e5f9e28e61ed1e76aa23d49a013969e130f215337e4cbcc4c1ba6c986ecbe9"
faqs:
  - question: "Klasik bir SSL sertifikası kurumsal güvenliği sağlamak için neden tek başına yetersizdir?"
    answer: "Standart bir TLS/SSL sertifikası yalnızca sunucu ile tarayıcı arasındaki veri trafiğini şifreler; ortadaki adam (MitM) SSL sıyırma saldırılarını, zararlı script enjeksiyonlarını (XSS) veya clickjacking açıklarını engellemez. 2026 kurumsal güvenlik standartları, tarayıcının HTTP bağlantısını baştan reddettiği HSTS Preload, katı Content Security Policy (CSP) ve Cross-Origin izolasyon başlıklarının eksiksiz uygulanmasını şart koşar."
  - question: "SSG (Statik Site Oluşturma) mimarisi bir web sitesini siber saldırılara karşı nasıl bağışık hale getirir?"
    answer: "Siber saldırıların %95'i canlı sunuculardaki dinamik yorumlayıcılara (PHP, Node.js), açık veritabanı portlarına (MySQL, PostgreSQL) ve SQL enjeksiyon açıklarına odaklanır. Astro SSG gibi statik mimarilerde canlı web sunucusunda hiçbir veritabanı veya kod yürütücü bulunmaz; site saf HTML, CSS ve WebP dosyalarından ibarettir. Saldırganın sızabileceği bir arka plan oturumu veya veritabanı bulunmadığı için saldırı yüzeyi matematiksel olarak sıfırdır."
  - question: "Content Security Policy (CSP) başlığı neden 'unsafe-inline' içermemelidir?"
    answer: "'unsafe-inline' direktifi, HTML gövdesine yazılmış herhangi bir JavaScript kodunun çalışmasına izin verir. Bu durum, web sitenize üçüncü parti bir widget veya reklam kodu üzerinden zararlı script enjekte edildiğinde (XSS) tarayıcının bunu engelleyememesi demektir. Katı bir CSP'de tüm scriptler 'self' veya kriptografik 'nonce' ile kısıtlanır, böylece yetkisiz hiçbir harici kod çalışamaz."
  - question: "Yapay zeka arama botları (OAI-SearchBot, Perplexity) ile agresif kazıyıcılar edge seviyesinde nasıl ayrıştırılır?"
    answer: "Cloudflare WAF kural setlerinde; Googlebot, Bingbot, OAI-SearchBot ve PerplexityBot gibi meşru AI arama motorları ASN ve User-Agent doğrulamasıyla beyaz listeye (allow) alınırken, içerik hırsızlığı yapan yetkisiz botlar (ByteSpider, CCBot vb.) WAF Managed Challenge veya doğrudan 403 Forbidden ile engellenir. Böylece SEO ve GEO görünürlüğü korunurken sunucu kaynakları korunur."
---

## Kurumsal Web Siteleri: Siber Saldırganların En Kolay Giriş Kapısı

Kurumsal şirketlerin bilgi işlem (IT) ve siber güvenlik direktörleriyle yaptığım görüşmelerde sıkça karşılaştığım tehlikeli bir yanılgı vardır: Şirket içi ERP sistemleri, güvenlik duvarları ve VPN hatları en katı standartlarla korunurken, şirketin dış dünyaya açılan web sitesi genellikle *"pazarlamanın işi"* denilerek göz ardı edilir.

Oysa gelişmiş tehdit aktörleri (APT) ve otomatik fidye yazılımı botları, bir kuruma sızmak için şirketinizin iç ağını değil, dışarıda unutulmuş, güncellenmeyen WordPress eklentilerini veya korumasız web sunucularını hedef alır. Ele geçirilen bir kurumsal web sitesi; şirketinizin kurumsal itibarını yok etmekle kalmaz, e-posta alan adınızın kara listeye girmesine ve müşterilerinizin kimlik avı (phishing) saldırılarına maruz kalmasına yol açar.

2026 yılı itibarıyla kurumsal web güvenliği, "yeşil bir SSL kilit ikonu" almaktan çok daha öteye geçmiştir. 

Bu yayında; bilgi işlem ekiplerinin ve tedarik direktörlerinin denetlemesi gereken 5 temel kurumsal web siber güvenlik standardını inceliyoruz.

```mermaid
flowchart TD
    Attacker["Otomatik Bot / Siber Saldırgan<br/>(SQLi • XSS • RCE Arayışı)"] --> CloudflareEdge["Cloudflare WAF & Edge Savunması<br/>(Katı Güvenlik Başlıkları & Rate Limiting)"]
    CloudflareEdge -->|Yetkisiz Kazıyıcı / Açık Tarayıcı| Block["403 Forbidden / Managed Challenge"]
    CloudflareEdge -->|Doğrulanmış İstek| StaticBucket["Astro SSG Statik Deposu<br/>(Sıfır PHP • Sıfır Canlı SQL • Salt Okunur)"]
    StaticBucket --> BrowserSecurity["İstemci Tarayıcı İzolasyonu<br/>(HSTS Preload • Strict CSP • COOP/COEP)"]
    BrowserSecurity --> SafeUser["Güvenli Kurumsal Müşteri / Alıcı"]
```

---

## 2026 Bilgi İşlem Denetiminde Aranacak 5 Güvenlik Kriteri

Bir web projesini kabul etmeden önce bilgi işlem departmanınızın mutlaka doğrulaması gereken 5 mimari katman:

### 1. HSTS Preload ve 2 Yıllık Zorunlu Şifreleme
Yalnızca `https://` protokolüne sahip olmak yetmez. Kullanıcı tarayıcıya sitenizin adresini yazdığında ilk istek HTTP üzerinden giderse, aradaki saldırgan (MitM) bağlantıyı ele geçirerek kullanıcıyı sahte bir siteye yönlendirebilir (SSL Stripping).

Bunu engellemek için kurumsal sitelerde **HSTS Preload** başlığı zorunludur:

```http
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

Bu başlık; sitenizin Google Chrome, Firefox ve Apple Safari çekirdeğindeki dahili "HSTS Preload List" veritabanına kaydedilmesini sağlar. Tarayıcı, sitenize daha ilk bağlantıda dahi HTTP protokolünü doğrudan reddeder; şifresiz iletişim donanımsal olarak imkansız hale gelir.

### 2. Strict CSP (İçerik Güvenlik Politikası) ile XSS İzolasyonu
Web sitelerinin %60'ından fazlası Siteler Arası Betik Çalıştırma (XSS) saldırılarına açıktır. Bilgisizce eklenen bir sayaç kodu veya üçüncü parti canlı destek widget'ı, sitenize sızan saldırganın kullanıcıların form verilerini çalmasına olanak tanır.

2026 standardında bir web sitesi katı bir CSP başlığı ile servis edilmelidir:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';
```

Bu kural; siteniz üzerinde yetkisiz hiçbir harici JavaScript dosyasının veya `eval()` fonksiyonunun çalıştırılamayacağını tarayıcı seviyesinde garanti eder.

### 3. Statik Site (SSG) Mimarisi ile Sıfır Saldırı Yüzeyi
Kurumsal güvenliğin altın kuralı basittir: **Var olmayan bir şeyi hackleyemezsiniz.**

Geleneksel web sitelerinde sunucuda çalışan PHP yorumlayıcısı, Python framework'ü veya açık MySQL veritabanı portları sürekli yeni güvenlik açıkları (CVE) üretir. [Ankara web yazılım](/ankara-web-yazilim/) ve kurumsal altyapı projelerimizde uyguladığımız Astro SSG modelinde, üretim sunucusunda hiçbir kod yorumlayıcısı veya veritabanı bulunmaz. Sayfalar derleme anında oluşturulur ve salt okunur statik dosyalar olarak dağıtılır. Saldırganın SQL sorgusu atabileceği bir veritabanı bulunmadığı için siber saldırı yüzeyi matematiksel olarak sıfıra iner.

### 4. Permissions-Policy ve Donanım İzolasyonu
Modern tarayıcılar; sitelere kamera, mikrofon, coğrafi konum ve USB cihazlara erişim yetkisi tanır. Kurumsal bir ihracat veya tanıtım sitesinin kullanıcının mikrofonuna veya kamerasına erişmesi anlamsız bir güvenlik açığıdır.

Web sunucusu üzerinden yayınlanacak modern bir `Permissions-Policy` başlığı ile:

```http
Permissions-Policy: accelerometer=(), camera=(), geolocation=(), microphone=(), payment=(), usb=()
```

Kullanıcının tarayıcısındaki tüm hassas donanım arayüzleri siteniz için tamamen devre dışı bırakılır; böylece tedarikçileriniz veya alıcılarınız sitenizi gezerken en yüksek gizlilik güvencesine sahip olur.

### 5. Cloudflare WAF, VIP AI Arama Botları ve Kazıyıcı Yönetimi
2026 yılında kurumsal siteler devasa bir yapay zeka botu akınıyla karşı karşıyadır. Ancak burada kritik bir ayrım yapılmalıdır:
- **İzin Verilmesi Gereken VIP Botlar:** Googlebot, Bingbot, OAI-SearchBot (ChatGPT Arama) ve PerplexityBot gibi meşru AI arama motorları sitenizi indekslemeli ve yanıt motorlarına taşımalıdır.
- **Engellenmesi Gereken Kazıyıcılar:** Şirketinizin ürün kataloglarını, teknik şartnamelerini ve fiyat politikalarını çalan yetkisiz botlar (ByteSpider, anonim Python scraper'ları).

The Vault bölümünde paylaştığım [2026 Kurumsal Siber Güvenlik Başlıkları & WAF Konfigürasyonu](/vault/b2b/enterprise-security-headers-2026.conf), Cloudflare Edge seviyesinde bu ayrımı milisaniyeler içinde yapan hazır kural setlerini içerir.

---

## Kurumsal Güvenlik Başlıkları Matrisi

Bilgi işlem ekibinizin `curl -I` veya [SEO Lens](/projects/seo-lens/) gibi analiz araçlarıyla doğrulaması gereken kontrol matrisi:

| Güvenlik Başlığı | Minimum Kabul Değeri | Güvenlik Amacı |
|---|---|---|
| **Strict-Transport-Security** | `max-age=63072000; includeSubDomains; preload` | SSL Stripping ve MitM saldırılarını önleme |
| **Content-Security-Policy** | `default-src 'self'; object-src 'none'; ...` | XSS ve yetkisiz veri sızıntılarını donanımsal engelleme |
| **X-Frame-Options** | `DENY` | Clickjacking ve iframe içi sahte form saldırılarını önleme |
| **X-Content-Type-Options** | `nosniff` | Kötü amaçlı MIME türü tahminini engelleme |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | Dış sitelere hassas token ve URL parametresi sızmasını önleme |
| **Cross-Origin-Opener-Policy** | `same-origin` | Yan kanal ve bellek sızıntısı saldırılarını izole etme |
| **Permissions-Policy** | `camera=(), microphone=(), geolocation=()` | Tarayıcı donanım erişimlerini kapatarak gizlilik sağlama |

---

## Bilgi İşlem Ekipleri İçin Eylem Planı

Kurumsal web varlıklarınızın siber güvenlik duruşunu uluslararası standartlara taşımak için [Ankara kurumsal web tasarım](/ankara-kurumsal-web-tasarim/) standartlarımız doğrultusunda şu 3 adımı devreye alabilirsiniz:

1. **Güvenlik Başlığı Taraması:** Sitenizin mevcut başlıklarını `securityheaders.com` üzerinden test edin ve A+ skorunu hedefleyin.
2. **Kasa Konfigürasyonunu İndirin:** The Vault'tan [enterprise-security-headers-2026.conf](/vault/b2b/enterprise-security-headers-2026.conf) dosyasını alıp Nginx veya Cloudflare Edge kural setlerinize doğrudan entegre edin.
3. **Monolitik Altyapılardan Ayrılın:** Tıpkı [oaTeklif](/broadcasts/oateklif-ucretsiz-teklif-olusturucu/) ve [oaPOS](/projects/oapos/) mimarilerimizde uyguladığımız gibi, kritik veri akışlarını statik ön yüzlerle yalıtarak sıfır güven (Zero-Trust) mimarisine geçiş yapın.

Kurumsal web siteniz, şirketinizin siber güvenlik disiplininin dış dünyaya açılan ilk kanıtıdır.
