---
title: "Free Open-Source Domain Expiry Tracker (DET) Script: WHOIS & Cron Job Setup"
description: "An automated self-hosted PHP/MySQL domain monitoring script that queries authoritative WHOIS registries over raw sockets, calculates renewal windows, and sends expiration alerts without recurring SaaS fees."
pubDate: 2023-04-22
lang: "en"
ref: "det-domain-takip-scripti"
featured: false
tags: ["DomainMonitoring", "WHOIS", "PHP", "MySQL", "CronJob", "OpenSource", "SysAdmin"]
youtubeId: "OAQLR3ZAfEY"
duration: "PT14M55S"
thumbnail: "https://i.ytimg.com/vi/OAQLR3ZAfEY/maxresdefault.jpg"
chapters:
  - time: "00:00"
    title: "What is DET & Engineering Motivation?"
  - time: "01:45"
    title: "GitHub Repository & File Structure"
  - time: "04:10"
    title: "Database Configuration & PHP Environment"
  - time: "07:30"
    title: "Raw Socket WHOIS Query Testing"
  - time: "10:45"
    title: "Cron Job Scheduling & Rate-Limiting Engine"
downloads:
  - name: "domain-expiry-tracker (GitHub)"
    size: "PHP/MySQL"
    type: "zip"
    driveUrl: "https://github.com/oaonuraksoy/domain-expiry-tracker"
---

## Eliminating the Operational Risk of Forgotten Domain Renewals

For systems architects, digital agencies, and portfolio investors, managing the expiration cycles of dozens or hundreds of critical domains represents a severe operational liability. A single overlooked domain expiration can instantly compromise corporate DNS routing, take email systems offline, or result in catastrophic domain poaching at public drop auctions.

Commercial domain monitoring SaaS platforms charge recurring monthly fees and impose arbitrary tracking limits. To solve this sustainably, I developed **Domain Expiry Tracker (DET)**—a lightweight, self-hosted PHP and MySQL utility that connects directly to authoritative TLD WHOIS registries over raw TCP sockets to monitor and alert on renewal cycles.

```mermaid
flowchart TD
    Cron["Scheduled Daemon (Cron Job)<br/>(Nightly Automated Trigger)"] --> Engine["DET Socket Query Engine<br/>(PHP fsockopen TCP :43)"]
    Engine --> WHOIS["Authoritative TLD Registries<br/>(Verisign, PIR, Nominet)"]
    WHOIS --> Parser["RegEx Normalizer<br/>(Standardizes Inconsistent Date Formats)"]
    Parser --> DB[("MySQL Persistence Layer<br/>(Days Remaining, Status Logs)")]
    Parser --> Alert{"Threshold Monitor<br/>(30, 15, 7, 1 Days?)"}
    Alert -->|Yes| Notify["Automated Email Dispatcher"]
```

---

## 1. Low-Level Socket WHOIS Architecture

DET bypasses commercial proxy services by establishing raw TCP connections directly to authoritative registry servers on port 43:

- Queries for `.com` and `.net` are routed to `whois.verisign-grs.com`.
- `.org` requests communicate directly with `whois.pir.org`.
- Raw response strings are parsed via an intelligent regular expression engine designed to accommodate hundreds of disparate registrar date formats (`YYYY-MM-DD`, `DD/MM/YYYY`, `ISO-8601`).
- The parsed expiration date is converted into normalized Unix epoch timestamps and stored in MySQL for differential date math.

---

## 2. Server Installation & Database Provisioning

Installation requires standard LAMP / LEMP hosting environments:
1. Clone the repository from GitHub into your target server directory.
2. Configure database credentials inside `config.php`.
3. Import the provided SQL schema (`schema.sql`) via phpMyAdmin or the MySQL CLI.
4. Access the administrative panel to ingest domain lists individually or in bulk.

---

## 3. Cron Job Scheduling & Rate-Limiting Engine

To automate nightly tracking, schedule the background runner using Linux crontab:

```bash
# Execute automated registry sweeps nightly at 03:00 UTC
0 3 * * * php /var/www/vhosts/yourdomain.com/httpdocs/det/cron.php >/dev/null 2>&1
```

> **Engineering Note on Rate-Limiting:** Public WHOIS registries enforce aggressive IP throttling when flooded with high-frequency sequential requests. DET implements intelligent jitter and randomized millisecond pauses between queries to prevent IP blocks and ensure uninterrupted tracking.

Explore the open-source code and download the deployment archive directly from GitHub.
