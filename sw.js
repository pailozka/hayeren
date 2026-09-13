const CACHE_NAME = 'hayeren-v3';
const APP_SHELL = [
  './',
  'index.html',
  'manifest.json',
  'css/main.css',
  'js/app.js',
  'js/storage.js',
  'js/audio.js',
  'js/srs.js',
  'js/nav.js',
  'js/daily.js',
  'js/alphabet.js',
  'js/quiz.js',
  'js/flashcards.js',
  'js/phrasebook.js',
  'js/review.js',
  'js/calendar.js',
  'js/dashboard.js',
  'js/data/letters.js',
  'js/data/vocabulary.js',
  'js/data/phrases.js',
  'js/data/grammar.js',
  'js/data/curriculum.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'images/carpet-bg.jpg',
  'images/carpet-band.jpg',
  'images/tatik-papik.png',
  'images/chess-print.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request)
        .then(response => {
          if (response.ok && event.request.url.startsWith(self.location.origin)) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
