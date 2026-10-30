/**
 * ZsirafVision v4.3 – Cloudflare Worker (a Vercel proxy teljes kiváltása)
 *
 * Végpontok:
 *   GET  /api/proxy?url=<stream>&ua=<ua>&ref=<referer>  – stream proxy, M3U8 átírás, CORS
 *   POST /api/report                                    – hibajelentés mentése KV-ba (REPORTS)
 *   GET  /api/report[?limit=50]                         – mentett jelentések listája
 *   GET  /api/stats                                     – állapot / régió / uptime
 *   GET  /health                                        – életjel
 */

const VERSION = '4.3';
const DEFAULT_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
let STARTED = 0; // Workers-ben a globális Date.now() 0, ezért az első kérésnél állítjuk

// Ismert csatorna-hostok (public/channels.json + adult.json alapján). Ezekről bármi jöhet.
const ALLOWED_HOSTS = new Set([
  '141.94.193.53', '193.225.32.62', '88.212.15.50', '88.212.7.14',
  'aegis-cloudfront-1.tubi.video', 'budapest-cache-1.antik.sk', 'cdn-euronews.akamaized.net',
  'cdn.fast.jwp.services', 'citytv.hu', 'cloudfront41.lexanetwork.com', 'cloudfront44.lexanetwork.com',
  'cloudfront63.lexanetwork.com', 'cronos.mangora1.cfd', 'dash2.antik.sk', 'live.apostoltv.hu',
  'makomedia.mikrohalo.hu', 'mumbai-edge.smartplaytv.in', 'oxygenmusic.hu', 'rtmp.radiobozsike.com',
  'rtmp1.40e.hu', 'stream.iptvservice.eu', 'stream.moranettv.hu', 'stream.nmih.hu',
  'stream.streaming4u.hu', 'stream.vasarhelyitelevizio.hu', 'stream.y5.hu',
  'streams.prd.commavservices.eu', '59ec5453559f0.streamlock.net', 'stream.miamitv.com',
  'videos.galleries.pornpros.com', 'pornstar4k.com', 'v1.paradisehill.cc',
]);
// Biztonságos tartalék: ismeretlen hostról (pl. Világ / iptv-org lista, CDN szegmensek)
// csak média kiterjesztésű URL-t és csak média / playlist választ engedünk át.
const MEDIA_EXT_RE = /\.(m3u8?|ts|aac|mp4|m4s|m4a|m4v|mp3|vtt|webvtt|key|fmp4|cmfv|cmfa)(\?|$)/i;
const MEDIA_CT_RE = /(mpegurl|video\/|audio\/|octet-stream|application\/mp4|binary)/i;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges',
  'Access-Control-Max-Age': '86400',
};

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { ...CORS, 'Content-Type': 'application/json; charset=utf-8' } });

export default {
  async fetch(request, env, ctx) {
    if (!STARTED) STARTED = Date.now();
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    const url = new URL(request.url);
    try {
      switch (url.pathname) {
        case '/':
        case '/health':
          return new Response(`OK – ZsirafVision Proxy v${VERSION}`, { headers: { ...CORS, 'Content-Type': 'text/plain; charset=utf-8' } });
        case '/api/proxy':
          return await handleProxy(request, url);
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
      return json({ error: String(err && err.message || err) }, 500);
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
  if (h.includes(':')) return h === '::1' || h === '::' || h.startsWith('fc') || h.startsWith('fd') || h.startsWith('fe80') || h.startsWith('::ffff:');
  return false;
}

function checkTarget(target) {
  let u;
  try { u = new URL(target); } catch { return { ok: false, msg: 'Érvénytelen url' }; }
  if (!['http:', 'https:'].includes(u.protocol)) return { ok: false, msg: 'Csak http/https engedélyezett' };
  if (isPrivateHost(u.hostname)) return { ok: false, msg: 'Belső hálózati cím tiltva' };
  if (u.port && !['80', '443', '8080', '1935', '8000', '8081', '8443', '88'].includes(u.port)) return { ok: false, msg: 'Port tiltva' };
  const known = ALLOWED_HOSTS.has(u.hostname.toLowerCase());
  if (!known && !MEDIA_EXT_RE.test(u.pathname + (u.search || ''))) return { ok: false, msg: 'Nem engedélyezett host (csak média URL)' };
  return { ok: true, u, known };
}

async function handleProxy(request, url) {
  if (!['GET', 'HEAD'].includes(request.method)) return json({ error: 'Method not allowed' }, 405);
  const target = url.searchParams.get('url');
  if (!target) return json({ error: 'Hiányzó ?url= paraméter' }, 400);
  const chk = checkTarget(target);
  if (!chk.ok) return json({ error: chk.msg }, 403);

  const ua = url.searchParams.get('ua') || DEFAULT_UA;
  const ref = url.searchParams.get('ref') || '';
  const headers = { 'User-Agent': ua, 'Accept': '*/*', 'Accept-Language': 'hu-HU,hu;q=0.9,en;q=0.8' };
  if (ref) { try { headers['Referer'] = ref; headers['Origin'] = new URL(ref).origin; } catch {} }
  const range = request.headers.get('Range');
  if (range) headers['Range'] = range;

  let up;
  try {
    up = await fetch(chk.u.toString(), { method: request.method, headers, redirect: 'follow', cf: { cacheTtl: 0 } });
  } catch (err) {
    return json({ error: `Upstream hiba: ${err.message}` }, 502);
  }
  // Átirányítás után is ellenőrizzük a végső címet
  if (up.url && up.url !== chk.u.toString()) {
    try { if (isPrivateHost(new URL(up.url).hostname)) return json({ error: 'Belső cím tiltva' }, 403); } catch {}
  }

  const ct = up.headers.get('Content-Type') || '';
  if (!chk.known && up.ok && ct && !MEDIA_CT_RE.test(ct) && !MEDIA_EXT_RE.test(chk.u.pathname)) {
    return json({ error: 'Nem média tartalom' }, 415);
  }

  const finalUrl = up.url || chk.u.toString();
  const isPlaylist = /mpegurl/i.test(ct) || /\.m3u8?(\?|$)/i.test(chk.u.pathname);
  if (isPlaylist && request.method === 'GET' && up.ok) {
    const text = await up.text();
    const self = `${url.protocol}//${url.host}`;
    return new Response(rewriteM3u8(text, finalUrl, self, url.searchParams.get('ua') || '', ref), {
      status: up.status,
      headers: { ...CORS, 'Content-Type': 'application/vnd.apple.mpegurl', 'Cache-Control': 'no-cache' },
    });
  }

  const h = new Headers(CORS);
  for (const k of ['Content-Type', 'Content-Length', 'Content-Range', 'Accept-Ranges', 'Last-Modified', 'ETag']) {
    const v = up.headers.get(k); if (v) h.set(k, v);
  }
  h.set('Cache-Control', 'no-cache');
  return new Response(up.body, { status: up.status, headers: h });
}

function rewriteM3u8(text, baseUrl, self, ua, ref) {
  const wrap = (u) => {
    const abs = new URL(u, baseUrl).toString();
    const p = new URLSearchParams({ url: abs });
    if (ua) p.set('ua', ua);
    if (ref) p.set('ref', ref);
    return `${self}/api/proxy?${p.toString()}`;
  };
  return text.split('\n').map((line) => {
    const t = line.trim();
    if (!t) return line;
    if (t.startsWith('#')) return t.includes('URI="') ? t.replace(/URI="([^"]+)"/g, (_, u) => `URI="${wrap(u)}"`) : line;
    return wrap(t);
  }).join('\n');
}

// ---------------------------------------------------------------------------
// Hibajelentések (KV: REPORTS)
// ---------------------------------------------------------------------------
const RATE_LIMIT = 5;          // jelentés / IP
const RATE_WINDOW_SEC = 600;   // 10 perc
const MAX_BODY = 16 * 1024;
const REPORT_TTL_SEC = 60 * 60 * 24 * 90; // 90 nap

async function handleReport(request, url, env) {
  if (!env.REPORTS) return json({ success: false, error: 'REPORTS KV nincs beállítva a Workeren' }, 503);

  if (request.method === 'GET') {
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10) || 50, 200);
    const list = await env.REPORTS.list({ prefix: 'report:', limit: 1000 });
    // A kulcsok fordított időbélyeggel kezdődnek → a legújabb van elöl
    const keys = list.keys.slice(0, limit);
    const reports = (await Promise.all(keys.map((k) => env.REPORTS.get(k.name, 'json')))).filter(Boolean);
    return json({ count: reports.length, total: list.keys.length, reports });
  }

  if (request.method !== 'POST') return json({ success: false, error: 'Method not allowed' }, 405);

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
  const report = {
    id, receivedAt: new Date(now).toISOString(),
    country: request.cf?.country || null, colo: request.cf?.colo || null,
    ...data,
  };
  const key = `report:${(9999999999999 - now).toString().padStart(13, '0')}:${id}`;
  await env.REPORTS.put(key, JSON.stringify(report), { expirationTtl: REPORT_TTL_SEC });
  await env.REPORTS.put(rlKey, String(used + 1), { expirationTtl: RATE_WINDOW_SEC });
  return json({ success: true, id });
}
