const CACHE_NAME = "study-app-cache-v4";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./favicon.png",
  "./success.mp3",
  "./complete.mp3",
  "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"
];

// Install the service worker and cache core assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Activate and clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      )
    )
  );
});

// Fetch event - serve cached content when offline
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // If the request is for a Google Sheets CSV, try cache first
  if (requestUrl.origin.includes("docs.google.com") && requestUrl.pathname.includes("/pub")) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(event.request)
            .then((response) => {
              return caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, response.clone());
                return response;
              });
            })
            .catch(() => cachedResponse || new Response("", { status: 503, statusText: "Offline" }))
        );
      })
    );
    return;
  }

  // Default fetch for other resources
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
