const CACHE = 'menu-pwa-v1';
const ASSETS = [
  './index.html',
  './manifest.json',
  './menu-data.js',
  './assets/logo.png'
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
});


self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).catch(() =>
        new Response("Offline or not found", { status: 503 })
      );
    })
  );
});
