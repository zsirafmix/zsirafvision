/**
 * ZsirafVision Service Worker (PWA)
 * Version: 3.9
 * Cache-First for static UI shell, Network-First for dynamic data, Pass-Through for live video streams
 */

const CACHE_NAME = 'zsirafvision-v3.9';

const STATIC_ASSETS = [
  './',
  './index.html',
  './remote.html',
  './css/style.css?v=3.9',
  './js/app.js?v=3.9',
  './js/i18n.js?v=3.9',
  './js/remote.js?v=3.9',
  './js/paho-mqtt.min.js',
  './assets/tv_frame_cutout.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
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

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Live video streams (.m3u8, .ts, .mp4), proxy and API calls should bypass cache completely
  if (
    url.pathname.endsWith('.m3u8') ||
    url.pathname.endsWith('.ts') ||
    url.pathname.endsWith('.mp4') ||
    url.pathname.includes('/api/') ||
    url.hostname.includes('vercel.app') ||
    url.hostname.includes('iptv') ||
    url.hostname.includes('peerjs') ||
    event.request.method !== 'GET'
  ) {
    return;
  }

  // Network-first with cache fallback for static app assets
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
