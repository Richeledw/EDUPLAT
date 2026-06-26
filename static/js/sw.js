/* =====================================================
   EDUPLAT — Service Worker
   Intercepta fallos de red y sirve offline.html
   ===================================================== */

const CACHE_NAME   = 'eduplat-offline-v1';
const OFFLINE_URL  = '/offline.html';

// ── Instalación: pre-cachea la página offline ─────────
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.add(OFFLINE_URL))
    );
    self.skipWaiting();
});

// ── Activación: limpia cachés antiguos ───────────────
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// ── Fetch: si falla la red, devuelve offline.html ────
self.addEventListener('fetch', event => {
    // Solo interceptamos peticiones de navegación (no XHR, no assets)
    if (event.request.mode !== 'navigate') return;

    event.respondWith(
        fetch(event.request).catch(() =>
            caches.open(CACHE_NAME).then(cache => cache.match(OFFLINE_URL))
        )
    );
});
