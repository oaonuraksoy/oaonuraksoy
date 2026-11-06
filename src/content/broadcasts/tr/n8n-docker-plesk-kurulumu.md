---
title: "n8n'den Rust & MCP Ajanlarına Geçiş: Docker/Plesk Kurulumu ve 2026 Otonom Mimari Kıyaslaması"
description: "Plesk ve Docker üzerinde n8n kurulum arşiv rehberi; 2026'da Node.js otomasyon araçları yerine neden Rust tabanlı Tinyflows, GraphBit ve MCP ajanlarına geçtik?"
seoTitle: "n8n vs. Rust & MCP Otonom Ajan Mimarisi"
seoDescription: "Plesk ve Docker üzerinde n8n kurulum arşiv rehberi; 2026'da Node.js otomasyon araçları yerine neden Rust tabanlı Tinyflows, GraphBit ve MCP ajanlarına geçtik?"
pubDate: 2025-04-04
updatedDate: 2026-11-06
lang: "tr"
ref: "n8n-docker-plesk-kurulumu"
featured: false
tags: ["Rust", "MCP", "n8n", "Otomasyon", "Docker", "Plesk", "SelfHosted", "DevOps"]
youtubeId: "VsdZFJN8ezI"
duration: "PT3M28S"
thumbnail: "/images/broadcasts/n8n-docker-plesk-kurulumu.webp"
chapters:
  - time: "00:00"
    title: "Neden Self-Hosted n8n?"
  - time: "00:35"
    title: "Plesk Docker n8n İmaj Kurulumu"
  - time: "01:20"
    title: "Port, Volume ve Ortam Değişkenleri"
  - time: "02:05"
    title: "Subdomain, SSL ve Reverse Proxy"
  - time: "02:50"
    title: "İlk Otomasyon Akışı Testi"
downloads:
  - name: "Docker Compose n8n Plesk Yapılandırması"
    size: "1.4 KB"
    type: "yml"
    driveUrl: "/vault/n8n/docker-compose-n8n-plesk.yml"
    hash: "sha256:bc9927eaa2cdc8df2e3ff63de4e0e4998d7729f14522380280a55b5309f05315"
  - name: "Tinyflows Rust DAG Engine (GitHub)"
    size: "Open Source"
    type: "web"
    driveUrl: "https://github.com/tinyhumansai/tinyflows"
  - name: "n8n Resmi Dokümantasyonu (Arşiv)"
    size: "Archive"
    type: "web"
    driveUrl: "https://github.com/n8n-io/n8n"
faqs:
  - question: "2026'da yeni bir projede n8n mi yoksa Rust/MCP tabanlı motorlar (Tinyflows, GraphBit, Goose) mı tercih edilmeli?"
    answer: "2026 kurumsal mimarilerinde ve otonom çoklu ajan sistemlerinde kesinlikle Rust çekirdekli deterministik DAG motorları (Tinyflows, GraphBit) ve MCP protokolü tercih edilmelidir. n8n basit webhook tetiklemeleri ve no-code ihtiyaçları için bir geçiş aracıydı; ancak bellek yönetimi, derleme anı tip güvenliği (WorkflowGraph), devre kesiciler ve deterministik çalışma gerektiren çoklu ajan orkestrasyonunda Rust altyapısı alternatifsizdir."
  - question: "Zapier veya Make yerine n8n kurmak neden bir ara çözüm olarak kaldı?"
    answer: "Zapier ve Make gibi SaaS servislerinin adım başı faturalandırma modelinden kaçmak için 2024-2025'te n8n önemli bir maliyet avantajı sağladı. Ancak yapay zeka ajanları geliştikçe, Node.js tabanlı n8n'in bellek sızıntıları, Fair-code lisans kısıtları ve kırılgan JSON şemaları kurumsal ölçekte Rust tabanlı motorlara geçişi zorunlu kıldı."
  - question: "Plesk Nginx ters proxy yapılandırmasında proxy_buffering off neden zorunludur?"
    answer: "n8n iş akışı düzenleyicisinde test çalıştırırken ve canlı logları görüntülerken Server-Sent Events (SSE) ve WebSocket akışlarını kullanır. Nginx tamponlama (buffering) açık kaldığında yanıtlar istemciye paketler dolana kadar gecikmeli iletilir; bu da arayüzde donmalara yol açar."
  - question: "n8n konteyneri yeniden başlatıldığında akışlarım ve kimlik bilgilerim kaybolur mu?"
    answer: "Hayır. /var/n8n_data sunucu dizini konteyner içindeki /home/node/.n8n dizinine hacim (volume mount) olarak bağlandığı sürece tüm iş akışları, şifreli anahtarlar ve yürütme geçmişi sunucu diskinde kalıcı olarak saklanır."
  - question: "Model Context Protocol (MCP) neden n8n düğümlerinin yerini aldı?"
    answer: "MCP, Anthropic tarafından başlatılan ve sektör standardı haline gelen açık bir protokoldür. Ajanların veritabanlarına, dosya sistemlerine ve API'lere standart JSON-RPC üzerinden tip güvenli erişmesini sağlar. n8n gibi her araç için ayrı bir görsel düğüm ve JS bağımlılığı yüklemek yerine, tek bir standart MCP sunucusu tüm ajan ekosistemine hizmet eder."
---

## 2026 Mimari Güncelleme: Neden Node.js Tabanlı n8n'i Geride Bırakıp Rust & MCP Mimarisine Geçtik?

2024 ve 2025 yıllarında Zapier ve Make gibi SaaS platformlarının adım başı sayaç (task toll) dayatan fahiş faturalandırma modellerinden kaçmak için **self-hosted n8n**, ekosistem için değerli bir ilk nesil ara çözümdü. Kendi VDS sunucumuzda Docker üzerinde n8n çalıştırmak, sıradan webhook yönlendirmelerinde ve temel bildirim akışlarında yüksek maliyet tasarrufu sağladı.

Ancak **2026 yılına geldiğimizde**, otonom çoklu ajan (multi-agent) mimarileri ve yüksek işlem hacimli kurumsal yapay zeka sistemleri devreye girdiğinde n8n'in temel kısıtları su yüzüne çıktı:

1. **V8 Engine ve Node.js Bellek Şişmesi:** Tek bir n8n konteyneri boşta dahi 450 MB – 1 GB RAM tüketir. Yüzlerce eşzamanlı ajan yürütmesinde bellek sızıntıları (OOM) yaşanması kaçınılmazdır.
2. **Kırılgan Çalışma Zamanı JSON Dönüşümleri:** Düğümler arasında tip garantisi olmayan serbest JSON nesneleri akıtılır. Akış ortasında meydana gelen şema kaymaları, sessiz başarısızlıklara ve veri kaybına yol açar.
3. **Deterministik Olmayan Döngüler:** Dahili LangChain sarmalayıcıları, ajanların sonsuz veya öngörülemez döngülere girmesini engelleyen katı matematiksel devre kesicilere (circuit breakers) sahip değildir.
4. **Fair-Code Lisans Kısıtlamaları:** n8n tam anlamıyla açık kaynak (permissive open-source) değildir; "Sustainable Use" lisansı ticari ölçekleme senaryolarında yasal gri alanlar yaratır.

### oaHub Üretim Altyapısının Yeni Omurgası: Rust & Model Context Protocol (MCP)

oaHub üretim altyapısında artık görsel sürükle-bırak Node.js kutucukları yerine **Rust çekirdekli deterministik DAG (Directed Acyclic Graph) motorları ve doğrudan Model Context Protocol (MCP)** kullanıyoruz:

- **`Tinyflows` (`tinyhumansai/tinyflows` + `tinymcp`):** `%100 Rust` (`#![forbid(unsafe_code)]`) ile yazılmış, tip güvenli `WorkflowGraph` durum makinesine sahip mikro orkestrasyon motoru. Konteyner şişkinliği olmadan, tek bir ikili dosya (binary) halinde saniyede binlerce ajan görevini 15 MB RAM ile paralel yürütür.
- **`GraphBit` (`InfinitiBit/graphbit`):** Rust çekirdekli deterministik çoklu ajan DAG motoru. Asenkron Tokio çalışma zamanı üzerinde yerleşik devre kesiciler (circuit breakers), katı durum doğrulaması ve sub-5ms işlem gecikmesi sunar.
- **`Goose` (`aaif-goose`) & Yerel MCP Sunucuları:** 70'ten fazla yerleşik Model Context Protocol uzantısıyla doğrudan ikili düzeyde çalışan, tarayıcı veya V8 bağımlılığı olmayan otonom ajan yürütme katmanı.

```mermaid
flowchart TD
    subgraph Legacy["Eski Nesil Yaklaşım (2024-2025 Arşiv)"]
        N8N["n8n (Node.js / V8 Engine)<br/>500MB+ RAM / Konteyner"]
        LangChain["LangChain / UI Düğümleri<br/>(Kırılgan JSON / Bellek Sızıntısı)"]
        N8N --> LangChain
    end

    subgraph Modern["2026 Otonom Mimari (oaHub Üretim Altyapısı)"]
        RustCore["Rust Deterministik DAG Motorları<br/>(Tinyflows & GraphBit)"]
        MCP["Model Context Protocol (MCP)<br/>Tip Güvenli Araç İletişimi"]
        Goose["Goose / Binary Native Agents<br/>Sub-5ms Gecikme / 15MB RAM"]
        RustCore --> MCP
        MCP --> Goose
    end
```

---

## 4 Sütunlu Mimari Kıyaslama: SaaS vs. n8n vs. 2026 Rust & MCP

Gerçek üretim iş yüklerimizden elde ettiğimiz maliyet, bellek, güvenlik ve operasyonel bağımsızlık verileri:

| Kriter | Zapier / Make (SaaS) | Self-Hosted n8n (Eski Nesil Node.js) | 2026 Rust & MCP Mimarisi (Tinyflows / GraphBit / Goose) |
|---|---|---|---|
| **Çalışma Zamanı & Bellek (RAM)** | Kapalı bulut altyapısı | V8 Engine / Node.js (~450MB–1GB RAM) | **Sıfır maliyetli soyutlama (Zero-cost Rust, ~8–25MB RAM)** |
| **Ajan Güvenliği & Tip Denetimi** | Yok (UI şablonları) | Çalışma zamanı JSON doğrulaması (kırılgan) | **Derleme anı (compile-time) tip garantisi (`#![forbid(unsafe_code)]`)** |
| **Yürütme Mantığı & Hata İzolasyonu** | Adım başı ücretli polling | Tekil Node.js event loop / OOM çökme riski | **Deterministik DAG durum makinesi + Devre Kesici (Circuit Breakers)** |
| **Araç Entegrasyon Standardı** | Tescilli SaaS konnektörleri | Topluluk düğümleri (Community nodes) | **Evrensel Model Context Protocol (MCP / Stdio & SSE)** |
| **Ajanlar Arası İletişim Gecikmesi** | 1000–5000 ms (Ağ gecikmesi) | 50–200 ms (Dahili kuyruk / Redis) | **Sub-5ms (Doğrudan ikili IPC / async-channel)** |
| **Lisans & Operasyonel Bağımsızlık** | Kapalı ticari SaaS | Fair-code (Sustainable use kısıtı) | **%100 Açık Kaynak (MIT / Apache-2.0, sıfır kısıt)** |

---

## Arşiv Kurulum Rehberi: Plesk & Docker ile n8n Kurulumu (2025 Video Adımları)

Aşağıdaki teknik adımlar, 2025 tarihli YouTube videomuzda (`VsdZFJN8ezI`) anlatılan ve geleneksel webhook/bildirim senaryoları için Plesk üzerinde n8n barındırmak isteyen geliştiriciler için eksiksiz arşiv dokümantasyonu olarak korunmaktadır.

```mermaid
flowchart TD
    Webhook["Dış Webhook Çağrısı<br/>(Stripe, GitHub, Webhook POST)"] -->|HTTPS 443| Nginx["Plesk Nginx Ters Proxy<br/>(proxy_buffering off; SSE Desteği)"]
    Nginx -->|Port 5678| n8n["n8n Konteyneri<br/>(Node.js Workflow Runtime)"]
    n8n --> Storage[("Kalıcı SQLite Verisi<br/>(/var/n8n_data)")]
    n8n --> Action["Uç Eylemler<br/>(Telegram, E-Posta, MySQL, S3)"]
```

### 1. Plesk Docker Kataloğunda n8n İmajı ve Konfigürasyonu

Plesk kontrol panelinizde **Docker > Docker Kataloğu** sekmesine gelin ve `n8nio/n8n` imajını aratıp indirin. Konteyner ayarlarında uygulanması gereken parametreler:

1. **Port Eşleştirmesi:**
   - Konteyner Portu: `5678`
   - Sunucu Portu: `5678` (Yalnızca yerel arabirime bağlı `127.0.0.1:5678`)
2. **Kalıcı Dizin Bağlantısı (Volume Mount):**
   Konteyner güncellemelerinde iş akışlarının silinmemesi için sunucu üzerinde `/var/n8n_data` dizinini oluşturun:
   - Sunucu Dizini: `/var/n8n_data`
   - Konteyner İçi Dizin: `/home/node/.n8n`
   - İzinler: `chown -R 1000:1000 /var/n8n_data`
3. **Kritik Ortam Değişkenleri:**
   ```text
   N8N_HOST=n8n.alanadiniz.com
   N8N_PORT=5678
   N8N_PROTOCOL=https
   WEBHOOK_URL=https://n8n.alanadiniz.com/
   GENERIC_TIMEZONE=Europe/Istanbul
   EXECUTIONS_DATA_PRUNE=true
   EXECUTIONS_DATA_MAX_AGE=168
   ```

### 2. Plesk Nginx Ters Proxy ve SSE Yapılandırması

n8n web arayüzünde canlı akış testleri yürütülürken arayüzün donmaması için Nginx ters proxy katmanında `proxy_buffering off;` tanımlanması zorunludur. Plesk'te ilgili alt alan adının **Ek Nginx Yönergeleri** bölümüne şu blok eklenir:

```nginx
location / {
    proxy_pass http://127.0.0.1:5678;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_buffering off;
    proxy_cache off;
    chunked_transfer_encoding off;
}
```

Bu yönerge kaydedilip Let's Encrypt SSL aktifleştirildiğinde, tarayıcınızdan `https://n8n.alanadiniz.com` adresine gittiğinizde ilk kurulum ekranı açılır.

### 3. Webhook ve Canlı Test Doğrulaması

Videoda canlı olarak test ettiğimiz iş akışında:
- Bir **Webhook** düğümü ekledik (Tetikleyici tipi: `POST`).
- Gelen JSON gövdesini bir **Code** düğümünde temizledik.
- Elde ettiğimiz metni resmi **Telegram Bot** düğümüne bağlayarak anında bildirim aldık.
- Test isteği 32 milisaniyede başarıyla tamamlandı.

---

## Sık Karşılaşılan Sorunlar ve Çözümleri (Arşiv Notları)

1. **"The connection to the server was lost" hatası:**
   - *Sebep:* Nginx ters proxy üzerinde WebSocket (`Upgrade`) başlıklarının eksik olması veya Cloudflare proxy modunda WebSockets seçeneğinin devre dışı kalması.
   - *Çözüm:* Nginx yönergelerine `proxy_http_version 1.1;` ve `proxy_set_header Upgrade $http_upgrade;` satırlarını ekleyin.
2. **Konteyner yeniden başlayınca kullanıcı verilerinin sıfırlanması:**
   - *Sebep:* `/home/node/.n8n` dizininin sunucudaki yerel diske bağlanmaması.
   - *Çözüm:* Docker hacim bağlantısında `/var/n8n_data:/home/node/.n8n` tanımını doğrulayın.
3. **Webhook URL'lerinin `localhost` olarak üretilmesi:**
   - *Çözüm:* `WEBHOOK_URL` çevre değişkenini mutlaka tam alan adınızla tanımlayın (`https://n8n.alanadiniz.com/`).
