const CACHE_NAME = "cobras-public-v3";
const ASSETS = ["./", "./index.html", "./styles.css", "./app.js", "./calendrier.html", "./calendrier.css", "./calendrier.js", "./inscription.html", "./cobras-logo.png", "./manifest-public.json"];
self.addEventListener("install", (event) => event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))));
self.addEventListener("activate", (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))));
self.addEventListener("fetch", (event) => event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request))));
