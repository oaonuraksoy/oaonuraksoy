---
title: "C# .NET SMS & OTP API Integration Guide (İleti Merkezi XML API Library)"
description: "A lightweight, open-source C# .NET class wrapper for the İleti Merkezi SMS Gateway. Send single notifications, bulk campaigns, high-priority 2FA OTP codes, and query credit balances with type-safe methods."
pubDate: 2022-09-23
lang: "en"
ref: "csharp-ileti-merkezi-sms-api"
featured: false
tags: ["CSharp", "DotNet", "SMSAPI", "OTP", "IletiMerkezi", "OpenSource", "Integration"]
youtubeId: "q-UZsK0krAk"
duration: "PT3M15S"
thumbnail: "https://i.ytimg.com/vi/q-UZsK0krAk/maxresdefault.jpg"
chapters:
  - time: "00:00"
    title: "SMS & OTP Architecture in C# .NET"
  - time: "00:40"
    title: "XML Payload Architecture & Authentication"
  - time: "01:30"
    title: "Single, Bulk & OTP Message Methods"
  - time: "02:25"
    title: "Balance Query & Live Dispatch Test"
downloads:
  - name: "iletimerkezi-cSharp-XML-Api (GitHub)"
    size: "C# Class"
    type: "cs"
    driveUrl: "https://github.com/oaonuraksoy/iletimerkezi-cSharp-XML-Api"
---

## Reliable SMS & OTP Dispatch for Enterprise .NET Applications

From desktop point-of-sale applications to web APIs, telecommunications gateways are essential for two-factor authentication (2FA/OTP), operational alerts, and transactional confirmations. However, raw telecom carrier specifications are often bogged down by non-standard XML schemas and inconsistent error responses.

To streamline this pipeline, I developed the **İleti Merkezi C# XML API Library**—a zero-dependency, type-safe wrapper that drops directly into any .NET application via a single class file.

```mermaid
flowchart LR
    App[".NET / C# Application<br/>(WPF, WinForms, Web API)"] --> Client["SMS Gateway Client<br/>(Type-Safe C# Wrapper)"]
    Client --> Serializer["XML Payload Serializer<br/>(Authentication & Sender ID)"]
    Serializer -->|HTTPS POST| Gateway["Carrier SMS Gateway<br/>(api.iletimerkezi.com)"]
    Gateway --> Telecom["GSM Operators & End User Device"]
```

---

## 1. Architectural Principles

- **Zero External Dependencies:** Built strictly on core .NET `System.Net` and `System.Xml` namespaces, preventing NuGet dependency bloat.
- **Single & Bulk Messaging:** Supports instantaneous single transactional dispatches as well as multi-recipient batch arrays within a single HTTPS connection.
- **Low-Latency OTP Delivery:** Minimized XML payloads optimized for millisecond-level transit time during user login and security handshakes.
- **Real-Time Telemetry & Originator Verification:** Query remaining SMS account credits and validate verified alphanumeric sender IDs dynamically prior to dispatch.

---

## 2. Integration Example

Once imported, dispatching authenticated messages requires just a few lines of code:

```csharp
using IletiMerkeziApi;

// Initialize the API client with your gateway credentials
var smsClient = new SmsSender("API_KEY", "API_HASH", "SENDER_ID");

// Dispatch a single transactional message
string response = smsClient.TekliSmsGonder("5511817053", "Your verification code: 849201");

// Query remaining account balance
string balance = smsClient.BakiyeSorgula();
Console.WriteLine($"Remaining Balance: {balance}");
```

Download the class library and explore the source code directly on GitHub.
