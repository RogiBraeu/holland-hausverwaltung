// ── SERVICE WORKER – Ferienhaus Holland ──────────────────────────────────
// Version hochzählen bei jedem Update der App!
const CACHE_NAME = 'ferienhaus-v1';

const ASSETS = [
  './',
  './index.html'
];

// Installation: Assets cachen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  // Sofort aktivieren, nicht auf alten SW warten
  self.skipWaiting();
});

// Aktivierung: Alten Cache löschen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: Netzwerk zuerst, Cache als Fallback (offline)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Frische Antwort auch im Cache speichern
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Nachricht vom Hauptfenster empfangen (z.B. "skipWaiting")
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
