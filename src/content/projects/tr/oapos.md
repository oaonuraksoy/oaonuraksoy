---
title: "oaPOS — Windows Masaüstü POS & Gerçek Zamanlı Stok Takip Mimarisi"
description: "Yerel HOST/CLIENT dağıtık ağ mimarisi üzerine kurulu, sıfır bulut bağımlılığı ve 10 milisaniye altı işlem gecikmesi sunan Microsoft Store onaylı Windows masaüstü satış ve envanter yönetim sistemi."
lang: "tr"
role: "Baş Sistem Mimarı & Masaüstü Yazılım Geliştirici"
period: "2024 — Günümüz"
status: "Canlıda / Microsoft Store Sertifikalı"
featured: true
order: 1
tags: [".NET 8", "WPF / DirectX", "C#", "PostgreSQL", "SQLite Embedded", "Redis Cache", "Yerel Soket Senkronizasyonu", "MS Store"]
accentColor: "#C58A3A"
links:
  store: "https://apps.microsoft.com/detail/9n0wq4v12wgx?hl=tr-TR&gl=TR"
metrics:
  - label: "İşlem Gecikmesi"
    value: "< 10ms"
  - label: "Çevrimdışı Direnç"
    value: "%100 Otonom"
  - label: "Mağaza Sertifikası"
    value: "Resmi MS Store"
  - label: "Terminal Senkronizasyonu"
    value: "Gerçek Zamanlı LAN"
ogImage: "/images/oa-logo-dark.webp"
---

## Projeye Genel Bakış

Yüksek tempolu perakende ve restoran işletmelerinde, tamamen buluta bağımlı POS (Satış Noktası) sistemleri ciddi operasyonel kırılganlıklar barındırır: İnternet kesintilerinde kasa kilitlenir, yüksek API gecikmeleri kasa kuyruklarını uzatır ve her ay ödenen zorunlu yazılım kiraları işletmelere maliyet yükü oluşturur.

**oaPOS**, bu yapısal sorunları kökünden çözmek amacıyla tasarlandı. Resmi Microsoft Store üzerinde onaylanmış ve dağıtımda olan sistem, çevrimdışı öncelikli (**offline-first**) yerel dağıtık mimariyle inşa edilmiştir. Geliştirilen **HOST/CLIENT yerel soket senkronizasyonu** sayesinde, internet bağlantısına ihtiyaç duymadan mikrosaniye seviyesinde barkod okuma, anlık fiş basımı ve kesintisiz işletme operasyonu sağlar.

## Temel Mimari Prensipleri

```
+--------------------------------------------------------------------+
|                         YEREL LAN AĞI                              |
|                                                                    |
|  +--------------------+                   +---------------------+  |
|  |   CLIENT KASA      | <--- LAN Soket ---> |      HOST ANA KASA  |  |
|  |   (Terminal)       |    (İkili Protokol) |  (Merkezi Veritabanı)| |
|  +--------------------+                   +---------------------+  |
|            |                                         |             |
|    Bellek-İçi Önbellek                     İlişkisel Veri Katmanı  |
|      (Anlık Okuma)                          (ACID İşlem Garantisi) |
+--------------------------------------------------------------------+
```

### 1. Sıfır Bulut Bağımlılığı & Yerel Öncelikli Güvenilirlik
Kasadaki her işlem kesinlik gerektirir. oaPOS, tüm satış kayıtlarını, stok düşümlerini ve cari hesap hareketlerini doğrudan optimize edilmiş yerel veritabanı motorunda (PostgreSQL kümesi / SQLite Embedded & Redis bellek önbelleği) işler. Sistem harici bir sunucuya tek bir bayt göndermeden yıllarca çalışabilir; bu da veri gizliliğini ve internet arızalarında %100 iş sürekliliğini garanti eder.

### 2. HOST / CLIENT Çoklu Terminal Yerel Ağ Senkronizasyonu
Birden fazla kasaya sahip işletmeler için özel olarak geliştirilen yerel ağ soket protokolü:
- **Ana Kasa (Host Node):** Merkezi veritabanını, mali mühürleri ve birincil stok bakiyesini yönetir.
- **İstemci Kasalar (Client Nodes):** Yerel ağ üzerinden otomatik keşif (broadcast discovery) ile ana kasaya bağlanır; satılan ürünler, stok rezervasyonları ve ödemeler 10 milisaniyenin altında senkronize edilir.
- **Kesinti Toleransı:** Ağda fiziksel bir kopma yaşanırsa terminaller kendi yerel kuyruklarında satışa devam eder; bağlantı onarıldığında çakışmasız biçimde ana kasayla uzlaşır.

### 3. WPF & Donanım Hızlandırmalı Akıcı Arayüz
.NET platformunda Windows Presentation Foundation (WPF) ile geliştirilen kullanıcı arayüzü, DirectX donanım hızlandırmasından tam verim alır. Barkod okuyucu tetiklemeleri doğrudan düşük seviyeli giriş kancalarıyla (raw input) yakalanır, seri ürün okutmada dahi sıfır girdi kaybı yaşanır.

### 4. Kurumsal Envanter & Mali Raporlama
- Detaylı stok kategorizasyonu, varyasyonlu barkod tanımları, tedarikçi ve son kullanma tarihi takibi.
- Gün sonu Z-raporu hesaplamaları, kasiyer devir bakiyeleri ve ESC/POS protokolüyle doğrudan termal fiş yazıcı yönetimi.
- Windows Desktop Bridge ve MSIX paketleme standartlarıyla resmi Microsoft Store güvenlik denetimlerinden tam puan.

## Teknoloji Yığını

- **Çalışma Zamanı & Dil:** .NET 8 / C#
- **Görsel Katman:** WPF / XAML ve donanım hızlandırmalı özel bileşenler
- **Veritabanı Katmanı:** PostgreSQL (küme) / SQLite Embedded (otonom) & Redis (bellek-içi durum)
- **Ağ İletişimi:** Asenkron TCP Soketleri ve ikili serileştirme
- **Yazıcı Desteği:** ESC/POS termal komut derleyicisi (USB, Seri Port, Ethernet)
- **Dağıtım:** MSIX ve Windows Store Paketleme

## Sağlanan Katma Değer

Aylık abonelik masraflarını ortadan kaldıran ve internet kesintilerinde kasayı kilitlemeyen oaPOS, perakende işletmelerinde **%99.999 kasa erişilebilirliği**, sıfır sunucu gideri ve yoğun saatlerde belirgin kuyruk erimesi sağlamıştır.
