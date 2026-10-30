/**
 * ZsirafVision v4.5 – Cloudflare Worker (proxy + hibajelentő + stats)
 *
 * Végpontok:
 *   GET  /api/proxy?url=<stream>&ua=<ua>&ref=<referer>[&exp=&sig=]  – stream proxy, M3U8 átírás
 *   POST /api/report                       – hibajelentés mentése KV-ba (REPORTS)
 *   GET  /api/report[?limit=50]            – jelentések listája (CSAK tokennel: Authorization: Bearer <REPORT_TOKEN>)
 *   GET  /api/stats                        – állapot
 *   GET  /health                           – életjel
 *
 * Biztonság (v4.5):
 *   - Szigorú host allowlist: public/allowed_hosts.json (channels.json + adult.json + iptv-org Világ lista).
 *     A playlistekből származó szegmens/al-playlist URL-ek HMAC-aláírást kapnak (RENDER_SIGN_KEY),
 *     így CDN-hostok is működnek, de tetszőleges URL nem proxyzható.
 *   - IP-címes / nem 80-443 portos cél -> 302 a Render proxyhoz (server.py), aláírt URL-lel.
 *   - Csak média tartalomtípus (m3u8, ts, m4s, aac, mp4, kulcs) mehet át; méret- és időkorlát.
 *   - IP-nkénti rate limit (proxy: memóriában, jelentés: KV), CORS csak a saját oldalnak, biztonsági fejlécek.
 *
 * Titkok (wrangler secret put): REPORT_TOKEN, RENDER_SIGN_KEY
 */
import HOSTS from '../public/allowed_hosts.json';

const VERSION = '4.5';
const DEFAULT_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const RENDER_PROXY = 'https://zsirafvision-proxy2.onrender.com';
const ALLOWED_HOSTS = new Set([...(HOSTS.channels || []), ...(HOSTS.world || [])].map((h) => h.toLowerCase()));
const ALLOWED_ORIGINS = new Set(['https://zsirafmix.github.io']);
const LOCAL_ORIGIN_RE = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const MEDIA_CT_RE = /(mpegurl|video\/mp2t|video\/mp4|video\/iso\.segment|audio\/aac|audio\/mp4|audio\/mpeg|application\/mp4|octet-stream|binary\/octet-stream|video\/x-flv)/i;
const PLAYLIST_RE = /\.m3u8?(\?|$)/i;
const MAX_PLAYLIST = 2 * 1024 * 1024;
const MAX_SEGMENT = 40 * 1024 * 1024;
const UPSTREAM_TIMEOUT_MS = 15000;
const SIGN_TTL_SEC = 6 * 3600;
const PROXY_RATE_PER_MIN = 900;
let STARTED = 0;

const SEC_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000',
};

function corsFor(request) {
  const o = request.headers.get('Origin');
  if (o && (ALLOWED_ORIGINS.has(o) || LOCAL_ORIGIN_RE.test(o))) {
    return {
      'Access-Control-Allow-Origin': o,
      Vary: 'Origin',
      'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Range, Authorization',
      'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges',
      'Access-Control-Max-Age': '86400',
    };
  }
  return {};
}
const originOk = (request) => {
  const o = request.headers.get('Origin');
  return !o || ALLOWED_ORIGINS.has(o) || LOCAL_ORIGIN_RE.test(o);
};

let CUR_CORS = {};
const hdr = (extra = {}) => ({ ...SEC_HEADERS, ...CUR_CORS, ...extra });
const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: hdr({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }) });

// ---------------------------------------------------------------------------
// HMAC aláírás (ugyanaz a formátum, mint server.py-ban)
// ---------------------------------------------------------------------------
let KEY_CACHE = null;
async function hmacKey(env) {
  if (!env.RENDER_SIGN_KEY) return null;
  if (!KEY_CACHE) {
    KEY_CACHE = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.RENDER_SIGN_KEY), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  }
  return KEY_CACHE;
}
async function sign(env, url, exp, ua, ref) {
  const key = await hmacKey(env);
  if (!key) return '';
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${url}|${exp}|${ua}|${ref}`))).slice(0, 18);
  return btoa(String.fromCharCode(...mac)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
async function sigValid(env, url, exp, ua, ref, sig) {
  if (!sig || !exp || !(+exp > Date.now() / 1000)) return false;
  const want = await sign(env, url, exp, ua, ref);
  return !!want && safeEqual(want, sig);
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------
export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(fetch(`${RENDER_PROXY}/health`).catch(() => {})); // Render ébren tartása
  },

  async fetch(request, env, ctx) {
    if (!STARTED) STARTED = Date.now();
    CUR_CORS = corsFor(request);
    if (request.method === 'OPTIONS') return new Response(null, { status: originOk(request) ? 204 : 403, headers: hdr() });
    const url = new URL(request.url);
    try {
      switch (url.pathname) {
        case '/':
        case '/health':
          return new Response(`OK – ZsirafVision Proxy v${VERSION}`, { headers: hdr({ 'Content-Type': 'text/plain; charset=utf-8' }) });
        case '/api/proxy':
          return await handleProxy(request, url, env);
        case '/api/report':
          return await handleReport(request, url, env);
        case '/api/stats':
          return json({
            status: 'ONLINE', version: VERSION, platform: 'cloudflare-workers',
            region: request.cf?.colo || 'n/a', country: request.cf?.country || 'n/a',
            uptimeSec: Math.round((Date.now() - STARTED) / 1000),
            reportsStorage: env.REPORTS ? 'kv' : 'nincs beállítva',
          });
        default:
          return json({ error: 'Not Found' }, 404);
      }
    } catch (err) {
      return json({ error: 'Belső hiba' }, 500);
    }
  },
};

// ---------------------------------------------------------------------------
// Proxy
// ---------------------------------------------------------------------------
function isPrivateHost(host) {
  const h = host.toLowerCase().replace(/^\[|\]$/g, '');
  if (h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.local') || h.endsWith('.internal')) return true;
  const m = h.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (m) {
    const [a, b] = [+m[1], +m[2]];
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224;
  }
  if (h.includes(':')) return true; // IPv6 literál: nem használunk, tiltjuk
  if (/^\d+$/.test(h) || /^0x/i.test(h)) return true; // decimális / hex IP trükkök
  return false;
}
const isIpLiteral = (h) => /^\d{1,3}(\.\d{1,3}){3}$/.test(h);
const needsRender = (u) => isIpLiteral(u.hostname) || (u.port !== '' && u.port !== '80' && u.port !== '443');

const RL = new Map();
function proxyRateOk(ip) {
  const min = Math.floor(Date.now() / 60000);
  const k = `${ip}:${min}`;
  const n = (RL.get(k) || 0) + 1;
  RL.set(k, n);
  if (RL.size > 5000) for (const key of RL.keys()) if (!key.endsWith(`:${min}`)) RL.delete(key);
  return n <= PROXY_RATE_PER_MIN;
}

async function renderRedirect(env, target, ua, ref) {
  const p = new URLSearchParams({ url: target });
  if (ua) p.set('ua', ua);
  if (ref) p.set('ref', ref);
  const exp = String(Math.floor(Date.now() / 1000) + SIGN_TTL_SEC);
  const sig = await sign(env, target, exp, ua, ref);
  if (sig) { p.set('exp', exp); p.set('sig', sig); }
  return new Response(null, { status: 302, headers: hdr({ Location: `${RENDER_PROXY}/api/proxy?${p}`, 'Cache-Control': 'no-store' }) });
}

async function handleProxy(request, url, env) {
  if (!['GET', 'HEAD'].includes(request.method)) return json({ error: 'Method not allowed' }, 405);
  if (!originOk(request)) return json({ error: 'Tiltott origin' }, 403);
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (!proxyRateOk(ip)) return json({ error: 'Túl sok kérés' }, 429);

  const target = url.searchParams.get('url') || '';
  const ua = url.searchParams.get('ua') || '';
  const ref = url.searchParams.get('ref') || '';
  if (!target || target.length > 4096 || ua.length > 512 || ref.length > 1024) return json({ error: 'Hibás paraméter' }, 400);
  let u;
  try { u = new URL(target); } catch { return json({ error: 'Érvénytelen url' }, 400); }
  if (!['http:', 'https:'].includes(u.protocol) || u.username || u.password) return json({ error: 'Csak http/https engedélyezett' }, 403);
  if (isPrivateHost(u.hostname) && !isIpLiteral(u.hostname)) return json({ error: 'Belső hálózati cím tiltva' }, 403);
  if (isIpLiteral(u.hostname) && isPrivateHost(u.hostname)) return json({ error: 'Belső hálózati cím tiltva' }, 403);

  const allowed = ALLOWED_HOSTS.has(u.hostname.toLowerCase()) ||
    await sigValid(env, target, url.searchParams.get('exp'), ua, ref, url.searchParams.get('sig'));
  if (!allowed) return json({ error: 'Nem engedélyezett host' }, 403);

  if (needsRender(u)) return renderRedirect(env, target, ua, ref);

  const headers = { 'User-Agent': ua || DEFAULT_UA, Accept: '*/*', 'Accept-Language': 'hu-HU,hu;q=0.9,en;q=0.8' };
  if (ref) { try { headers.Referer = ref; headers.Origin = new URL(ref).origin; } catch {} }
  const range = request.headers.get('Range');
  if (range) headers.Range = range;

  let up;
  try {
    up = await fetch(u.toString(), { method: request.method, headers, redirect: 'follow', signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS) });
  } catch {
    return renderRedirect(env, target, ua, ref);
  }
  if (up.status === 403 && up.headers.get('cf-ray') && !/mpegurl/i.test(up.headers.get('content-type') || '')) {
    const txt = await up.clone().text().catch(() => '');
    if (txt.includes('1003')) return renderRedirect(env, target, ua, ref);
  }
  if (up.url) {
    try { const f = new URL(up.url); if (isPrivateHost(f.hostname)) return json({ error: 'Belső cím tiltva' }, 403); } catch {}
  }

  const ct = up.headers.get('Content-Type') || '';
  const finalUrl = up.url || u.toString();
  const isPlaylist = /mpegurl/i.test(ct) || PLAYLIST_RE.test(new URL(finalUrl).pathname);
  if (!up.ok) return new Response(null, { status: up.status, headers: hdr({ 'Cache-Control': 'no-store' }) });
  if (!isPlaylist && !MEDIA_CT_RE.test(ct)) return json({ error: 'Nem média tartalom' }, 415);
  const clen = parseInt(up.headers.get('Content-Length') || '0', 10);
  if (clen > (isPlaylist ? MAX_PLAYLIST : MAX_SEGMENT)) return json({ error: 'Túl nagy válasz' }, 413);

  if (isPlaylist && request.method === 'GET') {
    const text = await up.text();
    if (text.length > MAX_PLAYLIST) return json({ error: 'Túl nagy playlist' }, 413);
    if (!text.trimStart().startsWith('#EXTM3U')) return json({ error: 'Nem M3U8' }, 415);
    const self = `${url.protocol}//${url.host}`;
    return new Response(await rewriteM3u8(env, text, finalUrl, self, ua, ref), {
      status: up.status,
      headers: hdr({ 'Content-Type': 'application/vnd.apple.mpegurl', 'Cache-Control': 'no-cache' }),
    });
  }

  const h = new Headers(hdr({ 'Cache-Control': 'no-cache' }));
  for (const k of ['Content-Type', 'Content-Length', 'Content-Range', 'Accept-Ranges', 'Last-Modified', 'ETag']) {
    const v = up.headers.get(k); if (v) h.set(k, v);
  }
  return new Response(up.body, { status: up.status, headers: h });
}

async function rewriteM3u8(env, text, baseUrl, self, ua, ref) {
  const exp = String(Math.floor(Date.now() / 1000) + SIGN_TTL_SEC);
  const wrap = async (raw) => {
    const abs = new URL(raw, baseUrl).toString();
    const p = new URLSearchParams({ url: abs });
    if (ua) p.set('ua', ua);
    if (ref) p.set('ref', ref);
    const sig = await sign(env, abs, exp, ua, ref);
    if (sig) { p.set('exp', exp); p.set('sig', sig); }
    return `${self}/api/proxy?${p.toString()}`;
  };
  const lines = text.split('\n');
  return (await Promise.all(lines.map(async (line) => {
    const t = line.trim();
    if (!t) return line;
    if (t.startsWith('#')) {
      if (!t.includes('URI="')) return line;
      const parts = [];
      let last = 0;
      for (const m of t.matchAll(/URI="([^"]+)"/g)) {
        parts.push(t.slice(last, m.index), `URI="${await wrap(m[1])}"`);
        last = m.index + m[0].length;
      }
      parts.push(t.slice(last));
      return parts.join('');
    }
    return wrap(t);
  }))).join('\n');
}

// ---------------------------------------------------------------------------
// Hibajelentések (KV: REPORTS)
// ---------------------------------------------------------------------------
const RATE_LIMIT = 5;
const RATE_WINDOW_SEC = 600;
const MAX_BODY = 16 * 1024;
const REPORT_TTL_SEC = 60 * 60 * 24 * 90;

function clean(v, depth = 0) {
  if (v === null || typeof v === 'boolean') return v;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string') return v.replace(/<[^>]*>/g, '').replace(/[<>]/g, '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').slice(0, 2000);
  if (depth >= 4) return null;
  if (Array.isArray(v)) return v.slice(0, 50).map((x) => clean(x, depth + 1));
  if (typeof v === 'object') {
    const o = {};
    for (const k of Object.keys(v).slice(0, 60)) {
      const key = String(k).replace(/[^\w.-]/g, '').slice(0, 64);
      if (key && !['__proto__', 'constructor', 'prototype', 'id', 'receivedAt', 'country', 'colo'].includes(key)) o[key] = clean(v[k], depth + 1);
    }
    return o;
  }
  return null;
}

async function handleReport(request, url, env) {
  if (!env.REPORTS) return json({ success: false, error: 'REPORTS KV nincs beállítva' }, 503);

  if (request.method === 'GET') {
    const auth = request.headers.get('Authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!env.REPORT_TOKEN || !safeEqual(token, env.REPORT_TOKEN)) return json({ error: 'Nincs jogosultság' }, 401);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10) || 50, 200);
    const list = await env.REPORTS.list({ prefix: 'report:', limit: 1000 });
    const keys = list.keys.slice(0, limit);
    const reports = (await Promise.all(keys.map((k) => env.REPORTS.get(k.name, 'json')))).filter(Boolean);
    return json({ count: reports.length, total: list.keys.length, reports });
  }

  if (request.method !== 'POST') return json({ success: false, error: 'Method not allowed' }, 405);
  if (!originOk(request)) return json({ success: false, error: 'Tiltott origin' }, 403);
  if (!/application\/json|text\/plain/i.test(request.headers.get('Content-Type') || '')) return json({ success: false, error: 'JSON kell' }, 415);
  const len = parseInt(request.headers.get('Content-Length') || '0', 10);
  if (len > MAX_BODY) return json({ success: false, error: 'Túl nagy jelentés' }, 413);

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const rlKey = `rl:${ip}`;
  const used = parseInt((await env.REPORTS.get(rlKey)) || '0', 10);
  if (used >= RATE_LIMIT) return json({ success: false, error: 'Túl sok jelentés, próbáld újra 10 perc múlva' }, 429);

  const raw = await request.text();
  if (raw.length > MAX_BODY) return json({ success: false, error: 'Túl nagy jelentés' }, 413);
  let data;
  try { data = JSON.parse(raw); } catch { return json({ success: false, error: 'Érvénytelen JSON' }, 400); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return json({ success: false, error: 'Érvénytelen adat' }, 400);

  const now = Date.now();
  const id = `${now.toString(36)}-${crypto.randomUUID().slice(0, 8)}`;
  const report = { ...clean(data), id, receivedAt: new Date(now).toISOString(), country: request.cf?.country || null, colo: request.cf?.colo || null };
  const key = `report:${(9999999999999 - now).toString().padStart(13, '0')}:${id}`;
  await env.REPORTS.put(key, JSON.stringify(report), { expirationTtl: REPORT_TTL_SEC });
  await env.REPORTS.put(rlKey, String(used + 1), { expirationTtl: RATE_WINDOW_SEC });
  return json({ success: true, id });
}
