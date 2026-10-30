/**
 * ZsirafVision Service Worker (PWA)
 * Version: 4.6.1
 * Cache-First for static UI shell, Network-First for dynamic data, Pass-Through for live video streams
 */

const CACHE_NAME = 'zsirafvision-v4.6.1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './remote.html',
  './css/style.css?v=4.6.1',
  './js/app.js?v=4.6.1',
  './js/i18n.js?v=4.6.1',
  './js/remote.js?v=4.6.1',
  './js/paho-mqtt.min.js',
  './assets/tv_frame_cutout.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png',
  './manifest.json',
  './channels.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('SW pre-cache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// v4.6.1: robusztus fetch-kezelő. Csak azonos eredetű GET kéréseket kezel,
// navigációnál mindig hálózat-első, és SOHA nem ad vissza üres/átirányított választ
// (Safari standalone módban az átirányított SW-válasz vagy undefined = fehér képernyő/indítási hiba).
function cleanResponse(res) {
  if (!res || !res.redirected) return Promise.resolve(res);
  return res.blob().then((b) => new Response(b, { status: res.status, statusText: res.statusText, headers: res.headers }));
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // CDN, proxy, API, stream: böngészőre bízva
  if (/\.(m3u8|ts|mp4)$/.test(url.pathname) || url.pathname.includes('/api/')) return;

  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const net = await fetch(req, { cache: 'no-store' });
        return await cleanResponse(net);
      } catch (e) {
        const c = await caches.match('./index.html', { ignoreSearch: true }) || await caches.match('./', { ignoreSearch: true });
        return c ? cleanResponse(c) : Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    try {
      const net = await fetch(req);
      if (net && net.ok && net.type === 'basic' && !net.redirected) {
        const copy = net.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
      }
      return net;
    } catch (e) {
      const c = await caches.match(req);
      return c || Response.error();
    }
  })());
});
