const CACHE = 'menu-pwa-v1';
const ASSETS = [
  './index.html',
  './manifest.json',
  './menu-data.js',
  './assets/logo.png'
];

// Install and cache required assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Activate immediately
});

// Activate and clear old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => {
        if (key !== CACHE) return caches.delete(key);
      }))
    )
  );
  self.clients.claim(); // Control open clients
});

// Fetch: Try network first, fallback to cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((res) => {
        return res || new Response("Offline or not found", {
          status: 503,
          statusText: "Offline or not found"
        });
      })
    )
  );
});
