const CACHE_NAME = "study-app-v2-cache";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(cacheNames.map(cache => { if(cache !== CACHE_NAME) return caches.delete(cache); }))
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});
