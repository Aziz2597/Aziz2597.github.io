const CACHE = 'menu-pwa-v1';
const ASSETS = [
  './index.html',
  './manifest.json',
  './menu-data.js',
  './assets/logo.png'
];
self.addEventListener("install", (event) => {
  // Force immediate activation
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Delete all old caches if any exist
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Always fetch from network (never use cache)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() =>
      new Response("Offline or not found", { status: 503 })
    )
  );
});
