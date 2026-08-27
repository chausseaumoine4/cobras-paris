const CACHE_NAME="cobras-player-v1";
const ASSETS=["./joueur.html","./joueur.js","./styles.css","./supabase-config.js","./cobras-logo.png","./manifest-player.json"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS))));
self.addEventListener("fetch",e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
