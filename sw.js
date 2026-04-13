const CACHE_NAME = 'smepi-pwa-v2';
const urlsToCache = [
    './',
    './index.html',
    './mandor.html',
    './petani.html',
    './app.js'
];

// Install Service Worker & Simpan Cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Ambil dari Cache jika tidak ada internet
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Kembalikan file dari cache jika ada, kalau tidak ambil dari internet
                return response || fetch(event.request);
            })
    );
});