
const CACHE_NAME = 'lab6-cache-v6';

const FILES_TO_CACHE = [
    // Страницы
    '/',
    '/about',
    '/index.html',
    '/about.html',

    // Основные файлы
    '/manifest.json',
    '/script.js',
    '/css/style.css',

    // Иконки приложения
    '/icons/icon-192.png',
    '/icons/icon-512.png',

    // Скриншоты PWA
    '/screenshots/desktop.png',
    '/screenshots/mobile.png',

    // Изображения портфолио
    '/images/Cat.png',
    '/images/IM1.png',
    '/images/IM2.png',
    '/images/IM3.png',
    '/images/Image1.jpg',
    '/images/Image2.jpg',
    '/images/image3.jpg',
    '/images/Image4.jpg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(FILES_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            );
        }).then(() => self.clients.claim())
    );
});


self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const responseCopy = response.clone();

                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseCopy);
                    });

                    return response;
                })
                .catch(() => {
                    return caches.match(event.request).then((cachedResponse) => {
                        return cachedResponse || caches.match('/');
                    });
                })
        );

        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});
