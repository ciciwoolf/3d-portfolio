const CACHE_NAME = 'portfolio-assets-v1';
const STATIC_ASSETS = ['/models/optimized-room.glb', '/textures/mat1.png'];

// Injected by build script: hashed asset URLs
let CACHE_ASSETS = STATIC_ASSETS.concat(JSON.parse('%HASHURLS%'));
CACHE_ASSETS = Array.from(new Set(CACHE_ASSETS));

// Pre-cache assets on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHE_ASSETS))
  );
  self.skipWaiting();
});

// Clean up old caches on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

// Serve cached assets, fallback to network
self.addEventListener('fetch', (event) => {
  if (
    event.request.url.endsWith('.glb') ||
    event.request.url.endsWith('.png')
  ) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((networkResponse) => {
            // Optionally cache new requests
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
        );
      })
    );
  }
});
