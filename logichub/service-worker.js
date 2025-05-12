const CACHE_NAME = 'logichub-app-v4';

const urlsToCache = [
    'service-worker.js',
    'style.css',
    'favicon.ico',
    'favicon.jpg',
    'index.html',
    'main.js',
    'manifest.json',
    'bananapen.png',
    'images/SComputers.png',
    'images/smserver.png',
    'images/temporarily_unavailable.png',
    'images/betterAPI.jpg',
    'images/NES_Emulator.jpg',
    'icons/discord.png',
    'icons/discord_raw.png',
    'icons/discord_server.pdn',
    'icons/discord_server.png',
    'icons/discord_server_raw.png',
    'icons/github.png',
    'icons/steam.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
