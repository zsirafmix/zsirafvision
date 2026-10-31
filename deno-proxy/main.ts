// ZsirafVision v4.7.1 – Deno Deploy proxy (a server.py PROXY_ONLY=1 módjának portja)
// Env: RENDER_SIGN_KEY (kötelező élesben), TLS_INSECURE_HOSTS (opcionális, vesszővel)
import hostsJson from "./allowed_hosts.json" with { type: "json" };

const VERSION = "4.7.1";
const SIGN_KEY = Deno.env.get("RENDER_SIGN_KEY") ?? "";
const SIGN_TTL = 6 * 3600;
const DEFAULT_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const ALLOWED_ORIGINS = new Set(["https://zsirafmix.github.io", "null"]);
const LOCAL_ORIGIN_RE = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const MEDIA_EXT_RE = /\.(m3u8?|ts|aac|mp4|m4s|m4a|m4v|mp3|vtt|key|fmp4|cmfv|cmfa)(\?|$)/i;
const MEDIA_CT_RE = /(mpegurl|video\/|audio\/|octet-stream|application\/mp4|binary\/octet)/i;
const MAX_PLAYLIST = 2 * 1024 * 1024;
const MAX_SEGMENT = 40 * 1024 * 1024;
const TIMEOUT_MS = 15000;
const RATE_MAX = 900;
const TLS_INSECURE = new Set([".lexanetwork.com", ...(Deno.env.get("TLS_INSECURE_HOSTS") ?? "").split(",").map((h) => h.trim().toLowerCase()).filter(Boolean)]);
const ALLOWED_HOSTS = new Set<string>([...((hostsJson as any).channels ?? []), ...((hostsJson as any).world ?? [])]);

const tlsInsecure = (host: string) => [...TLS_INSECURE].some((h) => host === h || (h.startsWith(".") && (host.endsWith(h) || host === h.slice(1))));

let insecureClient: Deno.HttpClient | null = null;
try {
  // deno-lint-ignore no-explicit-any
  insecureClient = (Deno as any).createHttpClient({ unsafelyIgnoreCertificateErrors: true } as any);
} catch { insecureClient = null; }

const rate = new Map<string, number>();
function rateOk(ip: string) {
  const now = Math.floor(Date.now() / 60000);
  const k = `${ip}|${now}`;
  rate.set(k, (rate.get(k) ?? 0) + 1);
  if (rate.size > 20000) for (const key of rate.keys()) if (!key.endsWith(`|${now}`)) rate.delete(key);
  return rate.get(k)! <= RATE_MAX;
}

function ipv4Bad(ip: string) {
  const p = ip.split(".").map(Number);
  if (p.length !== 4 || p.some((n) => isNaN(n) || n < 0 || n > 255)) return true;
  const [a, b] = p;
  return a === 0 || a === 10 || a === 127 || a >= 224 || (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) ||
    (a === 192 && b === 0) || (a === 198 && (b === 18 || b === 19)) || (a === 198 && b === 51) || (a === 203 && b === 0);
}
function ipBad(ip: string) {
  ip = ip.replace(/^\[|\]$/g, "").split("%")[0].toLowerCase();
  if (/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return ipv4Bad(ip);
  const m = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (m) return ipv4Bad(m[1]);
  if (!ip.includes(":")) return true;
  // IPv6: csak a globális unicast (2000::/3) engedett
  return !/^[23][0-9a-f]{0,3}:/.test(ip) || ip.startsWith("2001:db8") || ip.startsWith("2001:0db8");
}
async function hostBad(host: string) {
  host = host.replace(/^\[|\]$/g, "");
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host) || host.includes(":")) return ipBad(host);
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".internal") || host.endsWith(".local")) return true;
  const ips: string[] = [];
  try { ips.push(...await Deno.resolveDns(host, "A")); } catch { /* */ }
  try { ips.push(...await Deno.resolveDns(host, "AAAA")); } catch { /* */ }
  if (!ips.length) return false; // DNS-feloldás nem elérhető -> a fetch úgyis a nyilvános hálón megy
  return ips.some(ipBad);
}

const enc = new TextEncoder();
let keyP: Promise<CryptoKey> | null = null;
const b64url = (b: Uint8Array) => btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
async function sign(url: string, exp: string, ua: string, ref: string) {
  keyP ??= crypto.subtle.importKey("raw", enc.encode(SIGN_KEY), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", await keyP, enc.encode(`${url}|${exp}|${ua}|${ref}`)));
  return b64url(mac.slice(0, 18));
}
function safeEq(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
async function sigOk(url: string, exp: string, ua: string, ref: string, sig: string) {
  const e = Number(exp);
  if (!exp || !Number.isInteger(e) || e < Date.now() / 1000) return false;
  return !!sig && safeEq(await sign(url, exp, ua, ref), sig);
}

function corsHeaders(origin: string | null) {
  const h = new Headers({ "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer", "X-Frame-Options": "DENY" });
  if (origin && (ALLOWED_ORIGINS.has(origin) || LOCAL_ORIGIN_RE.test(origin))) {
    h.set("Access-Control-Allow-Origin", origin);
    h.set("Vary", "Origin");
    h.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    h.set("Access-Control-Allow-Headers", "Range, Content-Type");
    h.set("Access-Control-Expose-Headers", "Content-Length, Content-Range, Accept-Ranges");
  }
  return h;
}
const originOk = (o: string | null) => !o || ALLOWED_ORIGINS.has(o) || LOCAL_ORIGIN_RE.test(o);

function text(code: number, msg: string, origin: string | null, head = false) {
  const h = corsHeaders(origin);
  h.set("Content-Type", "text/plain; charset=utf-8");
  h.set("Cache-Control", "no-store");
  return new Response(head ? null : msg, { status: code, headers: h });
}

async function wrap(base: string, url: string, ua: string, ref: string) {
  const p = new URLSearchParams({ url });
  if (ua) p.set("ua", ua);
  if (ref) p.set("ref", ref);
  if (SIGN_KEY) {
    const exp = String(Math.floor(Date.now() / 1000) + SIGN_TTL);
    p.set("exp", exp);
    p.set("sig", await sign(url, exp, ua, ref));
  }
  return `${base}/api/proxy?${p}`;
}
async function rewrite(body: string, finalUrl: string, base: string, ua: string, ref: string) {
  const out: string[] = [];
  for (const line of body.split(/\r?\n/)) {
    const s = line.trim();
    if (s && !s.startsWith("#")) out.push(await wrap(base, new URL(s, finalUrl).href, ua, ref));
    else if (s.startsWith("#") && s.includes('URI="')) {
      const parts: string[] = [];
      let last = 0;
      for (const m of line.matchAll(/URI="([^"]+)"/g)) {
        parts.push(line.slice(last, m.index!), `URI="${await wrap(base, new URL(m[1], finalUrl).href, ua, ref)}"`);
        last = m.index! + m[0].length;
      }
      parts.push(line.slice(last));
      out.push(parts.join(""));
    } else out.push(line);
  }
  return out.join("\n");
}

async function fetchSafe(target: string, init: RequestInit, signal: AbortSignal): Promise<{ resp: Response; url: string }> {
  let url = target;
  for (let i = 0; i < 6; i++) {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    const opts: RequestInit & { client?: Deno.HttpClient } = { ...init, redirect: "manual", signal };
    if (tlsInsecure(host) && insecureClient) opts.client = insecureClient;
    const resp = await fetch(url, opts);
    if ([301, 302, 303, 307, 308].includes(resp.status) && resp.headers.get("location")) {
      const next = new URL(resp.headers.get("location")!, url);
      await resp.body?.cancel();
      if (!["http:", "https:"].includes(next.protocol) || await hostBad(next.hostname)) throw new HttpErr(403, "Tiltott atiranyitas");
      url = next.href;
      continue;
    }
    return { resp, url };
  }
  throw new HttpErr(502, "Tul sok atiranyitas");
}
class HttpErr extends Error { constructor(public code: number, msg: string) { super(msg); } }

async function handleProxy(req: Request, q: URLSearchParams, origin: string | null, base: string) {
  const head = req.method === "HEAD";
  const target = q.get("url") ?? "", ua = q.get("ua") ?? "", ref = q.get("ref") ?? "";
  if (!target || target.length > 4096) return text(400, "Hianyzo vagy hibas url", origin, head);
  let u: URL;
  try { u = new URL(target); } catch { return text(400, "Hianyzo vagy hibas url", origin, head); }
  if (!["http:", "https:"].includes(u.protocol) || !u.hostname) return text(403, "Csak http/https", origin, head);
  if (await hostBad(u.hostname)) return text(403, "Belso halozati cim tiltva", origin, head);
  if (SIGN_KEY) {
    if (!await sigOk(target, q.get("exp") ?? "", ua, ref, q.get("sig") ?? "")) return text(403, "Hianyzo vagy ervenytelen alairas", origin, head);
  } else if (!ALLOWED_HOSTS.has(u.hostname.toLowerCase()) && !MEDIA_EXT_RE.test(u.pathname)) {
    return text(403, "Nem engedelyezett host", origin, head);
  }
  const headers: Record<string, string> = { "User-Agent": ua || DEFAULT_UA, "Accept": "*/*" };
  if (ref) headers["Referer"] = ref;
  const rng = req.headers.get("range");
  if (rng) headers["Range"] = rng;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  let resp: Response, finalUrl: string;
  try {
    ({ resp, url: finalUrl } = await fetchSafe(target, { method: head ? "HEAD" : "GET", headers }, ctl.signal));
  } catch (e) {
    clearTimeout(timer);
    if (e instanceof HttpErr) return text(e.code, e.message, origin, head);
    return text(502, `Upstream hiba: ${(e as Error).name}: ${String((e as Error).message).slice(0, 80)}`, origin, head);
  }
  if (resp.status >= 400) {
    clearTimeout(timer);
    await resp.body?.cancel();
    return text(resp.status < 600 ? resp.status : 502, `Upstream HTTP ${resp.status}`, origin, head);
  }
  const ct = resp.headers.get("content-type") ?? "application/octet-stream";
  const fpath = new URL(finalUrl).pathname;
  const looksPlaylist = ct.toLowerCase().includes("mpegurl") || /\.m3u8?(\?|$)/.test(fpath);
  if (!looksPlaylist && !MEDIA_CT_RE.test(ct) && !MEDIA_EXT_RE.test(fpath)) {
    clearTimeout(timer); await resp.body?.cancel();
    return text(415, "Nem media tartalom", origin, head);
  }
  const clen = resp.headers.get("content-length");
  if (clen && /^\d+$/.test(clen) && Number(clen) > MAX_SEGMENT) {
    clearTimeout(timer); await resp.body?.cancel();
    return text(413, "Tul nagy valasz", origin, head);
  }
  const h = corsHeaders(origin);
  if (head) {
    clearTimeout(timer);
    h.set("Content-Type", ct);
    if (clen) h.set("Content-Length", clen);
    return new Response(null, { status: resp.status, headers: h });
  }
  if (looksPlaylist) {
    try {
      const buf = new Uint8Array(await resp.arrayBuffer());
      if (buf.length > MAX_PLAYLIST) return text(413, "Tul nagy playlist", origin);
      const body = new TextDecoder().decode(buf);
      if (!body.slice(0, 1024).includes("#EXTM3U")) return text(415, "Nem M3U8", origin);
      h.set("Content-Type", "application/vnd.apple.mpegurl");
      h.set("Cache-Control", "no-cache");
      return new Response(await rewrite(body, finalUrl, base, ua, ref), { status: resp.status, headers: h });
    } catch (e) {
      return text(502, `Upstream hiba: ${(e as Error).name}`, origin);
    } finally { clearTimeout(timer); }
  }
  clearTimeout(timer); // a segment streamelése közben nincs időkorlát-abort, csak méretkorlát
  h.set("Content-Type", ct);
  for (const k of ["content-length", "content-range", "accept-ranges"]) {
    const v = resp.headers.get(k);
    if (v) h.set(k, v);
  }
  h.set("Cache-Control", "no-cache");
  let sent = 0;
  const limiter = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, c) {
      sent += chunk.length;
      if (sent > MAX_SEGMENT) { c.terminate(); return; }
      c.enqueue(chunk);
    },
  });
  return new Response(resp.body!.pipeThrough(limiter), { status: resp.status, headers: h });
}

Deno.serve(async (req, info) => {
  const url = new URL(req.url);
  const origin = req.headers.get("origin");
  const head = req.method === "HEAD";
  if (req.method === "OPTIONS") return new Response(null, { status: originOk(origin) ? 204 : 403, headers: corsHeaders(origin) });
  if (req.method !== "GET" && !head) return text(405, "Method Not Allowed", origin);
  if (["/", "/health", "/healthz"].includes(url.pathname)) {
    return text(200, `OK - ZsirafVision proxy v${VERSION} (signed=${SIGN_KEY ? "yes" : "no"})`, origin, head);
  }
  if (url.pathname === "/api/proxy") {
    if (!originOk(origin)) return text(403, "Tiltott origin", origin, head);
    const ip = (req.headers.get("x-forwarded-for") ?? (info.remoteAddr as Deno.NetAddr).hostname ?? "").split(",")[0].trim();
    if (!rateOk(ip)) return text(429, "Tul sok keres", origin, head);
    const proto = (req.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "")).split(",")[0].trim();
    const base = `${proto === "http" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1" ? "https" : proto}://${url.host}`;
    return handleProxy(req, url.searchParams, origin, base);
  }
  return text(404, "Not Found", origin, head);
});
