// @ts-check
/**
 * src/utils/content-dates.mjs — Gerçek içerik tarihleri (lastmod / dateModified / datePublished).
 *
 * Kural (AGENTS.md §7.4): Hiçbir tarih alanı build anından (`new Date()`) üretilemez.
 * Tarihler, sayfanın KAYNAK içerik dosyalarının git geçmişinden türetilir:
 *   - lastModified  = kaynak dosyalardan herhangi birinin en son commit tarihi
 *   - firstPublished = kaynak dosyaların ilk commit tarihi
 * Commit edilmemiş (yerelde değiştirilmiş) dosyalar için dosya mtime kullanılır.
 * Git geçmişi yoksa veya sığ (shallow) klonsa tarih ÜRETİLMEZ (undefined) — sahte tarih
 * yazmaktansa alanı boş bırakmak arama motorları için daha güvenlidir.
 *
 * Bu modül hem astro.config.mjs (sitemap), hem Astro bileşenleri (JSON-LD, RSS),
 * hem de scripts/ping-search-engines.mjs (IndexNow) tarafından kullanılır.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PAGES_DIR = 'src/pages';
const BROADCASTS_DIR = 'src/content/broadcasts';
const PROJECTS_DIR = 'src/content/projects';

/** @param {string} p */
const norm = (p) => p.split(path.sep).join('/');

/** @type {Map<string, {last: string, first: string}> | null} */
let gitIndex = null;
/** @type {Set<string>} */
let dirtyFiles = new Set();
let gitUsable = false;

function loadGit() {
  if (gitIndex) return;
  gitIndex = new Map();
  try {
    const shallow = execSync('git rev-parse --is-shallow-repository', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (shallow === 'true') {
      console.warn('[content-dates] Sığ git klonu tespit edildi (fetch-depth: 0 gerekli); tarih alanları üretilmeyecek.');
      return;
    }
    const log = execSync('git log --format=@@%cI --name-only -- src', { cwd: ROOT, maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
    let current = '';
    for (const line of log.split('\n')) {
      if (line.startsWith('@@')) { current = line.slice(2).trim(); continue; }
      const file = line.trim();
      if (!file || !current) continue;
      const entry = gitIndex.get(file);
      // git log yeni → eski sıralıdır: ilk görülen = son değişiklik, son görülen = ilk yayın
      if (!entry) gitIndex.set(file, { last: current, first: current });
      else entry.first = current;
    }
    const status = execSync('git status --porcelain -- src', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
    dirtyFiles = new Set(status.split('\n').filter(Boolean).map((l) => l.slice(3).trim().replace(/^"|"$/g, '')));
    gitUsable = true;
  } catch {
    console.warn('[content-dates] git geçmişi okunamadı; tarih alanları üretilmeyecek.');
  }
}

/**
 * Yayın (Markdown) dosyalarında tarih git'ten DEĞİL editoryal frontmatter'dan gelir:
 * first = pubDate, last = updatedDate (yoksa pubDate). Böylece yalnızca meta/SEO alanı düzeltmesi
 * yapılan makalelerin dateModified değeri yapay olarak ilerlemez. İçerik gerçekten
 * güncellendiğinde frontmatter'a `updatedDate: YYYY-MM-DD` eklenir.
 * @param {string} file
 */
function editorialDates(file) {
  const abs = path.join(ROOT, file);
  if (!fs.existsSync(abs)) return null;
  const head = fs.readFileSync(abs, 'utf8').split(/\r?\n---/)[0];
  const pick = (/** @type {string} */ key) => {
    const m = head.match(new RegExp(`^${key}:\\s*["']?([0-9]{4}-[0-9]{2}-[0-9]{2}[^"'\\s]*)`, 'm'));
    return m ? new Date(m[1]).toISOString() : null;
  };
  const pub = pick('pubDate');
  if (!pub) return null;
  const upd = pick('updatedDate');
  return { first: pub, last: upd && Date.parse(upd) > Date.parse(pub) ? upd : pub };
}

/** @param {string} file */
function fileDates(file) {
  if (file.startsWith(`${BROADCASTS_DIR}/`) && file.endsWith('.md')) return editorialDates(file);
  loadGit();
  if (!gitUsable) return null;
  const abs = path.join(ROOT, file);
  if (dirtyFiles.has(file) || !gitIndex?.has(file)) {
    if (!fs.existsSync(abs)) return null;
    const mtime = fs.statSync(abs).mtime.toISOString();
    const committed = gitIndex?.get(file);
    return { last: mtime, first: committed ? committed.first : mtime };
  }
  return gitIndex.get(file) ?? null;
}

/** @param {string} dir @param {string} ext */
function listFiles(dir, ext) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs).filter((f) => f.endsWith(ext)).map((f) => `${dir}/${f}`);
}

/** @type {Map<string, string[]> | null} */
let routeMap = null;

/**
 * URL pathname → kaynak dosyalar haritası.
 * @returns {Map<string, string[]>}
 */
export function getRouteSources() {
  if (routeMap) return routeMap;
  routeMap = new Map();
  const trBroadcasts = listFiles(`${BROADCASTS_DIR}/tr`, '.md');
  const enBroadcasts = listFiles(`${BROADCASTS_DIR}/en`, '.md');
  const projectFiles = listFiles(PROJECTS_DIR, '.json');

  for (const [prefix, dir] of [['', PAGES_DIR], ['/en', `${PAGES_DIR}/en`]]) {
    const lang = prefix ? 'en' : 'tr';
    const langBroadcasts = lang === 'tr' ? trBroadcasts : enBroadcasts;
    for (const f of listFiles(dir, '.astro')) {
      const name = path.basename(f, '.astro');
      const route = name === 'index' ? `${prefix}/` : `${prefix}/${name}/`;
      const sources = [f];
      // Ana sayfa son yayınları ve öne çıkan projeleri listeler
      if (name === 'index') sources.push(...langBroadcasts, ...projectFiles);
      routeMap.set(route, sources);
    }
    routeMap.set(`${prefix}/broadcasts/`, [`${dir}/broadcasts/index.astro`, ...langBroadcasts]);
    routeMap.set(`${prefix}/projects/`, [`${dir}/projects/index.astro`, ...projectFiles]);
    for (const f of langBroadcasts) {
      routeMap.set(`${prefix}/broadcasts/${path.basename(f, '.md')}/`, [f]);
    }
    for (const f of projectFiles) {
      try {
        const slug = JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')).slug;
        if (slug) routeMap.set(`${prefix}/projects/${slug}/`, [f]);
      } catch { /* geçersiz JSON zaten Zod tarafından yakalanır */ }
    }
  }
  return routeMap;
}

/** @param {string} pathname */
function normalizePath(pathname) {
  let p = pathname.replace(/^https?:\/\/[^/]+/, '');
  if (!p.endsWith('/')) p += '/';
  return p;
}

/**
 * @param {string} pathnameOrUrl
 * @returns {string | undefined} ISO 8601 son değişiklik tarihi
 */
export function lastModified(pathnameOrUrl) {
  const sources = getRouteSources().get(normalizePath(pathnameOrUrl));
  if (!sources) return undefined;
  const dates = sources.map(fileDates).filter(Boolean).map((d) => /** @type {any} */ (d).last);
  if (!dates.length) return undefined;
  return new Date(Math.max(...dates.map((d) => Date.parse(d)))).toISOString();
}

/**
 * @param {string} pathnameOrUrl
 * @returns {string | undefined} ISO 8601 ilk yayın tarihi (sayfanın birincil kaynak dosyası)
 */
export function firstPublished(pathnameOrUrl) {
  const sources = getRouteSources().get(normalizePath(pathnameOrUrl));
  if (!sources) return undefined;
  const d = fileDates(sources[0]);
  return d ? new Date(d.first).toISOString() : undefined;
}

/**
 * Değişen kaynak dosyalarından etkilenen URL'leri döndürür (IndexNow bildirimi için).
 * @param {string[]} changedFiles repo köküne göre yollar
 * @returns {string[]} pathname listesi
 */
export function routesForChangedFiles(changedFiles) {
  const changed = new Set(changedFiles.map(norm));
  const out = [];
  for (const [route, sources] of getRouteSources()) {
    if (sources.some((s) => changed.has(s))) out.push(route);
  }
  return out.sort();
}
