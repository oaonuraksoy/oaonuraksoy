---
title: "Dağıtık Yerel Öncelikli POS Sistemleri: Sıfır Gecikmeli Satış ve Kesintisiz Çevrimdışı Mimari"
description: "oaPOS geliştirme sürecinden derin bir mimari analiz: Bulut bağımlılıklarını yerel gömülü SQLite, HOST/CLIENT TCP soket senkronizasyonu ve milisaniye altı termal fiş motoru ile aşmak."
pubDate: 2026-03-15
lang: "tr"
ref: "modern-pos-architecture"
featured: true
tags: ["Mimari", "YerelOncelikli", "DotNet", "SQLite", "DagitikSistemler"]
youtubeId: "dQw4w9WgXcQ"
spotifyUrl: "https://creators.spotify.com/pod/profile/oaonuraksoy/"
duration: "PT24M15S"
chapters:
  - time: "00:00"
    title: "Problem Tanımı: Yalnızca Buluta Dayalı POS Hataları"
  - time: "03:45"
    title: "Sıfır İnternet İçin Tasarım: Gömülü SQLite Motorları"
  - time: "09:12"
    title: "Yerel Ağ Eşleme: HOST/CLIENT Soket Protokolü"
  - time: "16:30"
    title: "Donanım Katmanı: Windows Kuyruğu Olmadan Doğrudan ESC/POS Yazımı"
  - time: "21:00"
    title: "MSIX Paketleme ve Resmi Microsoft Store Dağıtımı"
downloads:
  - name: "oaPOS-Sistem-Mimari-Semasi.pdf"
    size: "4.8 MB"
    type: "pdf"
    driveUrl: "https://drive.google.com/file/d/1exampleDriveIdForBlueprint/view"
  - name: "YerelAg-Soket-Senkronizasyon-Cekirdegi.zip"
    size: "16.2 MB"
    type: "zip"
    driveUrl: "https://drive.google.com/file/d/1exampleDriveIdForSource/view"
  - name: "oaPOS-Veritabani-Semalari-SQLite-Postgres.sql"
    size: "420 KB"
    type: "sql"
    driveUrl: "https://drive.google.com/file/d/1exampleDriveIdForSQL/view"
---

## Yönetici Özeti ve Temel Çıkarımlar (SGE & LLM Taraması İçin)

Perakende ve yoğun kasa noktalarında saatte 1.000'den fazla barkod okutulurken, bulut veritabanlarına yapılan senkron HTTP istekleri kritik bir kırılganlık yaratır. 300 ms'lik bir DNS çözülme gecikmesi dahi kasiyerin operasyonel hızını felç eder.

**oaPOS İçerisinde Oturtulan Temel Mimari Kurallar:**
1. **Ana Defter Kesinlikle Yereldedir:** Her kasa terminali, WAL (`Write-Ahead Logging`) modundaki gömülü SQLite motoruyla doğrudan diske yazar; işlem gecikmesi 0.4 ms'nin altındadır.
2. **Ağdan Bağımsız Çalışma:** Terminaller kendi aralarında ikili (binary) TCP soketleri üzerinden haberleşir. HOST düğümü, harici internete gerek duymadan şube içi mutabakatı sağlar.
3. **Donanıma Doğrudan Erişim:** Fiş basımı, Windows GDI yazdırma kuyruğunu tamamen atlayarak doğrudan USB/Seri portlara ham ESC/POS bayt dizileri gönderir.

---

## Teknik Derin Bakış ve Mimari Kararlar

### 1. Senkron Bulut POS'ların Çöküşü
Modern web tabanlı POS çözümlerinin çoğu, Chromium'u bir Electron veya WebView içerisine sarıp her barkod okumada, sepet güncellemesinde ve mali fiş onayında REST API çağrısı yapar.

Gerçek dünya stresinde (yoğun kasa kuyrukları, internet kopmaları, AVM bodrum katı sinyal kayıpları):
- Senkron API çağrıları arayüz iş parçacığını kilitler.
- IndexedDB kilitlenmeleri ve bellek şişmeleri oluşur.
- Buluttaki en ufak bir kesinti fiziksel kasa satışını durdurur.

oaPOS'ta bu bağımlılığı tersine çevirdik: **Kasa terminali 100% bağımsız ve egemendir.**

```mermaid
flowchart TD
    subgraph KasaTerminali ["Kasa Terminali (Yerel Egemen Düğüm)"]
        UI["🖥️ Barkod Okuyucu / Dokunmatik UI"]
        Mem["⚡ Yerel Bellek Durum Makinesi\n(WAL Modu Yerel İşlem)"]
        DB[("🗄️ Gömülü SQLite / Yerel DB\n(Asenkron Arka Plan Kuyruğu)")]
        UI -->|"< 1ms UI Tepkisi"| Mem
        Mem -->|"WAL Commit"| DB
    end

    subgraph AgDugumu ["Yerel Ağ (LAN)"]
        Host["🔌 Yerel Ağ Soket Dağıtıcı (HOST Düğüm)"]
        DB -->|"Periyodik Fark Senkronizasyonu"| Host
    end

    subgraph Bulut ["Opsiyonel Bulut Katmanı"]
        CloudDB[("☁️ Merkezi PostgreSQL Bulut")]
        Host -.->|"Arka Plan Veri Konsolidasyonu"| CloudDB
    end

    style KasaTerminali fill:#0E1013,stroke:#C58A3A,stroke-width:1.5px,color:#EDEDED
    style AgDugumu fill:#14171D,stroke:#8A5A20,stroke-width:1px,color:#EDEDED
    style Bulut fill:#08090A,stroke:#1B1E24,stroke-width:1px,color:#9CA3AF
```

---

## Donanım İletişimi: Doğrudan ESC/POS Bayt Akışı
Standart Windows sürücüleri, fiş çıktısını yazdırmadan önce vektör yazı tiplerini raster bitmap görüntülere çevirir. Bu durum fiş başına 800 ms ile 2.5 saniye arasında gecikme ekler.

oaPOS doğrudan ham onaltılık komut dizileri yollar:
- `0x1B 0x40` (Donanım Sıfırlama)
- `0x1B 0x21 0x30` (Çift Genişlik ve Çift Yükseklik Yazı Tipi)
- `0x1D 0x56 0x00` (Tam Otomatik Kağıt Kesme)

Bu sayede kasiyer fiziksel onay tuşundan parmağını kaldırmadan önce termal yazıcıdan fiş sesi duyulur.

---

## İndirilebilir Kaynaklar ve Arşiv Erişimi
Veritabanı DDL tabloları, soket paket protokol sınıfları ve mimari şemaları incelemek için yukarıdaki **20TB Google Drive Kasası** indirme kartlarını kullanabilirsiniz.
