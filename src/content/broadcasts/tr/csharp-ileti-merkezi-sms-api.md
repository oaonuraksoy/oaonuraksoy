---
title: ".NET C# İleti Merkezi SMS API Kullanımı: Tekli, Toplu SMS ve OTP Rehberi"
description: ".NET C# projelerinize İleti Merkezi SMS ağ geçidini entegre etmek için geliştirdiğim açık kaynaklı sınıf kütüphanesi. Tekli SMS, toplu mesaj gönderimi, dinamik OTP şifre doğrulama ve anlık bakiye sorgulama rehberi."
pubDate: 2022-09-23
lang: "tr"
ref: "csharp-ileti-merkezi-sms-api"
featured: false
tags: ["CSharp", "DotNet", "SMSAPI", "OTP", "IletiMerkezi", "AcikKaynak", "Entegrasyon"]
youtubeId: "q-UZsK0krAk"
duration: "PT3M15S"
thumbnail: "https://i.ytimg.com/vi/q-UZsK0krAk/maxresdefault.jpg"
chapters:
  - time: "00:00"
    title: "C# .NET Projelerinde SMS ve OTP"
  - time: "00:40"
    title: "XML API Paket Yapısı"
  - time: "01:30"
    title: "Tekli, Toplu ve OTP Metodları"
  - time: "02:25"
    title: "Bakiye Sorgulama ve Canlı Test"
downloads:
  - name: "iletimerkezi-cSharp-XML-Api (GitHub)"
    size: "C# Class"
    type: "cs"
    driveUrl: "https://github.com/oaonuraksoy/iletimerkezi-cSharp-XML-Api"
---

## Kurumsal Uygulamalarda Güvenilir SMS & OTP Entegrasyonu

Masaüstü uygulamalarından e-ticaret altyapılarına kadar modern kurumsal yazılımlarda kullanıcı doğrulaması (2FA/OTP), sipariş bildirimleri ve randevu hatırlatmaları için SMS ağ geçitleri kritik bir bileşendir. Ancak telekom sağlayıcılarının ham API dokümantasyonları genellikle karmaşık XML yapıları ve tutarsız hata kodlarıyla doludur.

Bu entegrasyonu standartlaştırmak amacıyla geliştirdiğim açık kaynaklı **İleti Merkezi C# XML API Kütüphanesi**, .NET projelerinize tek bir sınıf dosyasıyla eklenebilen, tip güvenli ve hata toleranslı bir wrapper sunar.

```mermaid
flowchart LR
    App[".NET / C# Uygulaması<br/>(WPF, WinForms, Web API)"] --> Client["İleti Merkezi API İstemcisi<br/>(Tip Güvenli C# Wrapper)"]
    Client --> Serializer["XML Veri Serileştirici<br/>(Kimlik Doğrulama & Gönderici Başlığı)"]
    Serializer -->|HTTPS POST| Gateway["İleti Merkezi SMS Gateway<br/>(api.iletimerkezi.com)"]
    Gateway --> Telecom["GSM Operatörleri & Son Kullanıcı"]
```

---

## 1. Kütüphanenin Mimari Özellikleri

- **Hafif ve Sıfır Bağımlılık:** Harici ağır NuGet paketleri gerektirmez; yerleşik .NET `System.Net` ve `System.Xml` sınıfları üzerinde çalışır.
- **Tekil ve Toplu SMS Desteği:** Tek bir telefon numarasına anlık işlem bildirimi gönderebileceğiniz gibi, binlerce numaraya tek bir HTTP isteğiyle farklı veya ortak mesaj içeriklerini toplu olarak iletebilirsiniz.
- **Kritik 2FA OTP Hızı:** Tek kullanımlık doğrulama şifreleri (OTP) için optimize edilmiş hafif istek gövdesiyle milisaniyeler içinde ağ geçidine ulaşır.
- **Hesap Bakiye ve Başlık (Originator) Kontrolü:** Gönderim öncesinde kalan SMS kredinizi ve operatör tarafından onaylanmış yasal başlıklarınızı dinamik olarak sorgulama imkanı sunar.

---

## 2. Örnek Kod Kullanımı

Kütüphaneyi projenize dahil ettikten sonra tek satırla SMS gönderebilirsiniz:

```csharp
using IletiMerkeziApi;

// API kimlik bilgilerinizi tanımlayın
var smsClient = new SmsSender("API_KEY", "API_HASH", "BASLIK");

// Tekli SMS Gönderimi
string sonuc = smsClient.TekliSmsGonder("5511817053", "Siparişiniz başarıyla onaylandı. Kod: 849201");

// Bakiye Sorgulama
string bakiye = smsClient.BakiyeSorgula();
Console.WriteLine($"Kalan SMS Bakiyesi: {bakiye}");
```

Videolu anlatımda adım adım canlı olarak test ettiğimiz sınıf kütüphanesini GitHub deposundan indirip doğrudan kendi projelerinize entegre edebilirsiniz.
