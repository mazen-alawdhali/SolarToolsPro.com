const CACHE_NAME = 'solartools-main-v1';
const urlsToCache = [
    './',
    './index.html',
    './site.webmanifest',
    './favicon-96x96.png',
    './favicon.svg',
    './favicon.ico',
    './apple-touch-icon.png',
    './preview_v2.png',
    './header_balanced_sky_600w.webp',
    './privacy.html',
    './about.html',
    './contact.html'
];

// تثبيت الملفات في التخزين المؤقت
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// تفعيل الخدمة وتنظيف الكاش القديم
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// جلب المحتوى من الكاش عند انقطاع الاتصال
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).catch(() => {
                    // يمكن توفير صفحة بديلة أوفلاين هنا إن لزم الأمر
                });
            })
    );
});
