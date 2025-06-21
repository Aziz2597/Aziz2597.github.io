const CACHE_NAME = 'bella-vista-menu-v1.2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Cache the actual HTML content inline since we're using a single file
];

// Install event - cache resources
self.addEventListener('install', function(event) {
  console.log('[SW] Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('[SW] Caching resources');
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        console.log('[SW] All resources cached');
        return self.skipWaiting(); // Activate immediately
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  console.log('[SW] Activate event');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      console.log('[SW] Cache cleanup complete');
      return self.clients.claim(); // Take control immediately
    })
  );
});
// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', function(event) {
  const url = new URL(event.request.url);

  // Only handle GET requests and HTTP/HTTPS protocols
  if (event.request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          console.log('[SW] Serving from cache:', event.request.url);
          return response;
        }

        console.log('[SW] Fetching from network:', event.request.url);
        return fetch(event.request)
          .then(function(response) {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(function(error) {
            console.warn('[SW] Network fetch failed:', error);
            return new Response('Offline - Content not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});


// Background sync for future enhancements
self.addEventListener('sync', function(event) {
  console.log('[SW] Background sync:', event.tag);
  // Can be used for syncing orders, reservations, etc.
});

// Push notifications for future enhancements
self.addEventListener('push', function(event) {
  console.log('[SW] Push message received');
  // Can be used for daily specials, promotions, etc.
});

// Handle app updates
self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
