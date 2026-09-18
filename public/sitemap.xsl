<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  exclude-result-prefixes="sitemap xhtml image video news">

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>
          <xsl:choose>
            <xsl:when test="sitemap:sitemapindex | sitemapindex">XML Sitemap Index | Onur Aksoy (Hackonomist)</xsl:when>
            <xsl:otherwise>XML Sitemap | Onur Aksoy (Hackonomist)</xsl:otherwise>
          </xsl:choose>
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <style type="text/css">
          <![CDATA[
          :root {
            --bg-color: #08090a;
            --card-bg: #0f1115;
            --card-border: rgba(197, 138, 58, 0.22);
            --gold: #c58a3a;
            --gold-light: #dfa95c;
            --gold-glow: rgba(197, 138, 58, 0.12);
            --text-main: #f3f4f6;
            --text-muted: #9ca3af;
            --table-header-bg: #14171d;
            --table-row-hover: rgba(197, 138, 58, 0.05);
            --border-color: #1f242d;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            background-color: var(--bg-color);
            color: var(--text-main);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            padding: 40px 24px;
            min-height: 100vh;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
          }
          header {
            background: linear-gradient(180deg, #13161d 0%, var(--card-bg) 100%);
            border: 1px solid var(--card-border);
            border-radius: 12px;
            padding: 32px;
            margin-bottom: 28px;
            box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.6), 0 0 24px 0 var(--gold-glow);
          }
          .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
            margin-bottom: 18px;
          }
          .brand-row {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .brand-badge {
            background: rgba(197, 138, 58, 0.12);
            color: var(--gold-light);
            border: 1px solid var(--gold);
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.08em;
            padding: 4px 10px;
            border-radius: 6px;
            text-transform: uppercase;
          }
          h1 {
            color: #ffffff;
            font-size: 26px;
            font-weight: 700;
            letter-spacing: -0.02em;
          }
          h1 span {
            color: var(--gold);
          }
          .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--gold-light);
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
            padding: 8px 16px;
            border-radius: 8px;
            background: rgba(197, 138, 58, 0.08);
            border: 1px solid rgba(197, 138, 58, 0.3);
            transition: all 0.2s ease;
          }
          .back-link:hover {
            background: rgba(197, 138, 58, 0.2);
            border-color: var(--gold);
            color: #ffffff;
          }
          p.desc {
            color: var(--text-muted);
            font-size: 14px;
            margin-bottom: 24px;
            max-width: 820px;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 16px;
          }
          .stat-card {
            background: #090a0e;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 16px 20px;
          }
          .stat-label {
            color: var(--text-muted);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin-bottom: 6px;
          }
          .stat-value {
            color: var(--gold-light);
            font-size: 24px;
            font-weight: 700;
          }
          .content-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.35);
          }
          .table-responsive {
            overflow-x: auto;
            width: 100%;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }
          th {
            background-color: var(--table-header-bg);
            color: var(--gold-light);
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            padding: 14px 20px;
            border-bottom: 1px solid var(--border-color);
            white-space: nowrap;
          }
          td {
            padding: 14px 20px;
            border-bottom: 1px solid var(--border-color);
            color: var(--text-main);
            vertical-align: middle;
          }
          tr:last-child td {
            border-bottom: none;
          }
          tr:hover td {
            background-color: var(--table-row-hover);
          }
          .index-cell {
            width: 44px;
            color: var(--text-muted);
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 12px;
          }
          .url-link {
            color: var(--text-main);
            text-decoration: none;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 13px;
            transition: color 0.15s ease;
            word-break: break-all;
          }
          .url-link:hover {
            color: var(--gold-light);
            text-decoration: underline;
          }
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            text-decoration: none;
            margin-right: 6px;
            margin-bottom: 4px;
            transition: all 0.15s ease;
          }
          .badge-alt {
            background: rgba(197, 138, 58, 0.12);
            color: var(--gold-light);
            border: 1px solid rgba(197, 138, 58, 0.3);
          }
          .badge-alt:hover {
            background: rgba(197, 138, 58, 0.25);
            border-color: var(--gold);
            color: #ffffff;
          }
          .text-muted {
            color: var(--text-muted);
            font-size: 12px;
          }
          footer {
            margin-top: 32px;
            text-align: center;
            color: var(--text-muted);
            font-size: 12px;
          }
          footer a {
            color: var(--gold);
            text-decoration: none;
          }
          footer a:hover {
            text-decoration: underline;
          }
          ]]>
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <div class="header-top">
              <div class="brand-row">
                <span class="brand-badge">Astro SSG</span>
                <h1>
                  <xsl:choose>
                    <xsl:when test="sitemap:sitemapindex | sitemapindex">
                      XML <span>Sitemap Index</span>
                    </xsl:when>
                    <xsl:otherwise>
                      XML <span>Sitemap</span>
                    </xsl:otherwise>
                  </xsl:choose>
                </h1>
              </div>
              <a href="https://onuraksoy.com.tr" class="back-link">
                ← onuraksoy.com.tr
              </a>
            </div>

            <p class="desc">
              This is a machine-readable XML sitemap generated for search engines (Googlebot, Bingbot, Yandex) and AI web agents (GEO/SGE), styled with an Obsidian Noir &amp; Gold stylesheet for human readability and route verification.
            </p>

            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-label">Total Routes / Sitemaps</div>
                <div class="stat-value">
                  <xsl:choose>
                    <xsl:when test="sitemap:sitemapindex | sitemapindex">
                      <xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap | sitemapindex/sitemap)"/>
                    </xsl:when>
                    <xsl:otherwise>
                      <xsl:value-of select="count(sitemap:urlset/sitemap:url | urlset/url)"/>
                    </xsl:otherwise>
                  </xsl:choose>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-label">Locales Supported</div>
                <div class="stat-value">EN / TR</div>
              </div>

              <div class="stat-card">
                <div class="stat-label">Standard &amp; Schema</div>
                <div class="stat-value" style="font-size: 18px; line-height: 28px;">Sitemaps.org 0.9</div>
              </div>
            </div>
          </header>

          <div class="content-card">
            <div class="table-responsive">
              <!-- CASE 1: SITEMAP INDEX -->
              <xsl:if test="sitemap:sitemapindex | sitemapindex">
                <table>
                  <thead>
                    <tr>
                      <th class="index-cell">#</th>
                      <th>Sitemap Location</th>
                      <th>Last Modified</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap | sitemapindex/sitemap">
                      <tr>
                        <td class="index-cell"><xsl:value-of select="position()"/></td>
                        <td>
                          <a class="url-link" href="{sitemap:loc | loc}">
                            <xsl:value-of select="sitemap:loc | loc"/>
                          </a>
                        </td>
                        <td>
                          <xsl:choose>
                            <xsl:when test="sitemap:lastmod | lastmod">
                              <span class="text-muted"><xsl:value-of select="sitemap:lastmod | lastmod"/></span>
                            </xsl:when>
                            <xsl:otherwise>
                              <span class="text-muted">—</span>
                            </xsl:otherwise>
                          </xsl:choose>
                        </td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </xsl:if>

              <!-- CASE 2: URLSET -->
              <xsl:if test="sitemap:urlset | urlset">
                <table>
                  <thead>
                    <tr>
                      <th class="index-cell">#</th>
                      <th>URL Location</th>
                      <th>Language Alternates (Hreflang)</th>
                      <th>Last Modified</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="sitemap:urlset/sitemap:url | urlset/url">
                      <tr>
                        <td class="index-cell"><xsl:value-of select="position()"/></td>
                        <td>
                          <a class="url-link" href="{sitemap:loc | loc}">
                            <xsl:value-of select="sitemap:loc | loc"/>
                          </a>
                        </td>
                        <td>
                          <xsl:choose>
                            <xsl:when test="xhtml:link[@rel='alternate']">
                              <xsl:for-each select="xhtml:link[@rel='alternate']">
                                <a class="badge badge-alt" href="{@href}" title="{@hreflang} version">
                                  <xsl:value-of select="@hreflang"/>: <xsl:value-of select="@href"/>
                                </a>
                              </xsl:for-each>
                            </xsl:when>
                            <xsl:otherwise>
                              <span class="text-muted">—</span>
                            </xsl:otherwise>
                          </xsl:choose>
                        </td>
                        <td>
                          <xsl:choose>
                            <xsl:when test="sitemap:lastmod | lastmod">
                              <span class="text-muted"><xsl:value-of select="sitemap:lastmod | lastmod"/></span>
                            </xsl:when>
                            <xsl:otherwise>
                              <span class="text-muted">—</span>
                            </xsl:otherwise>
                          </xsl:choose>
                        </td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </xsl:if>
            </div>
          </div>

          <footer>
            <p>
              Onur Aksoy (Hackonomist) Portfolio &#8226; Built with Astro &amp; Obsidian Noir Theme &#8226; <a href="https://onuraksoy.com.tr">onuraksoy.com.tr</a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
