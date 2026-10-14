const CACHE_NAME = 'solartools-main-v3';
const assetsToCache = [
    './',
    './index.html',
    './site.webmanifest',
    './header_balanced_sky_600w.webp',
    './preview_v2.png'
];

// تثبيت ذكي يتجنب فشل الكاش بالكامل إذا لم يتم العثور على ملف فرعي
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return Promise.allSettled(
                assetsToCache.map(url => cache.add(url).catch(err => console.log('Failed to cache:', url, err)))
            );
        }).then(() => self.skipWaiting())
    );
});

// تفعيل وتطهير الكاش القديم
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        }).then(() => self.clients.claim())
    );
});

// الاستجابة أوفلاين من التخزين المحلي
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => {
                // إذا انقطع الإنترنت ولم يكن الملف مخزناً، نرجع الصفحة الرئيسية كبديل آمن
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
