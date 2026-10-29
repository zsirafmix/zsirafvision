/**
 * ZsirafVision IPTV Proxy – Cloudflare Worker
 * Minden HTTP/HTTPS stream URL-t proxyzza, CORS headert ad hozzá,
 * M3U8 playlistben az URL-eket átírja önmagán keresztülre.
 */

const WORKER_BASE = 'https://zsirafvision-proxy.zsirafvision.workers.dev';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request, env) {
    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    // Health check
    if (url.pathname === '/health') {
      return new Response('OK – ZsirafVision Proxy él', {
        headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain' },
      });
    }

    // Only handle /api/proxy
    if (url.pathname !== '/api/proxy') {
      return new Response('Not Found', { status: 404 });
    }

    const targetUrl = url.searchParams.get('url');
    const ua = url.searchParams.get('ua') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const ref = url.searchParams.get('ref') || '';

    if (!targetUrl) {
      return new Response('Missing ?url= parameter', { status: 400, headers: CORS_HEADERS });
    }

    // Build upstream request headers
    const upstreamHeaders = {
      'User-Agent': ua,
      'Accept': '*/*',
      'Accept-Language': 'hu-HU,hu;q=0.9,en;q=0.8',
    };
    if (ref) {
      upstreamHeaders['Referer'] = ref;
      upstreamHeaders['Origin'] = new URL(ref).origin;
    }

    let upstreamResponse;
    try {
      upstreamResponse = await fetch(targetUrl, {
        method: request.method === 'HEAD' ? 'HEAD' : 'GET',
        headers: upstreamHeaders,
        redirect: 'follow',
      });
    } catch (err) {
      return new Response(`Proxy fetch error: ${err.message}`, {
        status: 502,
        headers: CORS_HEADERS,
      });
    }

    const contentType = upstreamResponse.headers.get('Content-Type') || '';

    // If M3U8 playlist → rewrite segment URLs through this proxy
    if (
      contentType.includes('mpegurl') ||
      contentType.includes('x-mpegURL') ||
      targetUrl.includes('.m3u8')
    ) {
      const text = await upstreamResponse.text();
      const rewritten = rewriteM3u8(text, targetUrl, ua, ref);
      return new Response(rewritten, {
        status: upstreamResponse.status,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Cache-Control': 'no-cache',
        },
      });
    }

    // Binary passthrough (TS segments, etc.)
    const responseHeaders = new Headers(CORS_HEADERS);
    if (contentType) responseHeaders.set('Content-Type', contentType);
    responseHeaders.set('Cache-Control', 'no-cache');

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  },
};

/**
 * Rewrite all URLs in an M3U8 playlist to go through this proxy.
 */
function rewriteM3u8(text, baseUrl, ua, ref) {
  const base = new URL(baseUrl);
  const lines = text.split('\n');
  const result = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Rewrite URI= attributes in tags (e.g. #EXT-X-KEY:URI="...")
    if (trimmed.startsWith('#') && trimmed.includes('URI="')) {
      const rewrittenTag = trimmed.replace(/URI="([^"]+)"/g, (match, uri) => {
        const absoluteUri = toAbsolute(uri, base);
        return `URI="${buildProxyUrl(absoluteUri, ua, ref)}"`;
      });
      result.push(rewrittenTag);
      continue;
    }

    // Rewrite segment/playlist URLs (non-comment lines)
    if (trimmed && !trimmed.startsWith('#')) {
      const absoluteUrl = toAbsolute(trimmed, base);
      result.push(buildProxyUrl(absoluteUrl, ua, ref));
      continue;
    }

    result.push(line);
  }

  return result.join('\n');
}

function toAbsolute(uri, base) {
  if (uri.startsWith('http://') || uri.startsWith('https://')) return uri;
  if (uri.startsWith('//')) return 'https:' + uri;
  if (uri.startsWith('/')) return `${base.protocol}//${base.host}${uri}`;
  // Relative path
  const basePath = base.pathname.substring(0, base.pathname.lastIndexOf('/') + 1);
  return `${base.protocol}//${base.host}${basePath}${uri}`;
}

function buildProxyUrl(url, ua, ref) {
  const params = new URLSearchParams({ url, ua });
  if (ref) params.set('ref', ref);
  return `${WORKER_BASE}/api/proxy?${params.toString()}`;
}
