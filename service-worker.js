// Name of the cache
const CACHE_NAME = "study-app-cache-v1";

// Files to cache (add your site’s important pages here)
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/icon.png"
];

// Install event - cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Fetch event - serve cached files if offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
