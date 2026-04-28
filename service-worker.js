/* ─────────────────────────────────────────────────────────────
   Navigator Gas – Service Worker
   Caches all app assets for offline use.
   Bump CACHE_NAME version (e.g. v2, v3) whenever you deploy
   updated files so users get the latest version.
   ───────────────────────────────────────────────────────────── */

const CACHE_NAME = "nav-gas-ess-v11";

const urlsToCache = [
  "/",
  "/index.html",
  "/navigator_vessel.css",
  "/app.js",
  "/manifest.json",
  "/logo.png",
  "/icon-192.png",
  "/icon-512.png",
  "/vessel.jpg",
  "/PBCF.jpg",
  "/VFD.png",
  "/LED.png",
  "/Duct.jpg",
  "/AF.jpg",
  "/Trim.jpg"
];

/* Install: cache all assets */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

/* Activate: remove old caches */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

/* Fetch: serve from cache, fall back to network */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
