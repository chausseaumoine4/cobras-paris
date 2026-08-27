const CACHE_NAME = "cobras-public-v4";
const ASSETS = ["./", "./index.html", "./styles.css", "./app.js", "./calendrier.html", "./calendrier.css", "./calendrier.js", "./inscription.html", "./cobras-logo.png", "./manifest-public.json"];
self.addEventListener("install", (event) => event.waitUntil(self.skipWaiting()));
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("install", (event) => event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))));
self.addEventListener("activate", (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))));
self.addEventListener("fetch", (event) => event.respondWith(fetch(event.request).then((response) => { const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)); return response; }).catch(() => caches.match(event.request))));
