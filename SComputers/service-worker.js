const CACHE_NAME = '1';

const urlsToCache = [
    'addons/Controllers.jpg',
    'addons/minimap_component.jpg',
    'addons/more_displays.jpg',
    'addons/online_boombox.jpg',
    'addons/power_toys.jpg',
    'addons/stretchable_display.jpg',
    'addons/world_disks.jpg',
    'addons.html',
    'antenna.html',
    'api.html',
    'base64.html',
    'camera.html',
    'cameraTunnel.html',
    'chaff.html',
    'colors.html',
    'components.html',
    'computer_data.html',
    'contact_me.html',
    'controllers.html',
    'disk.html',
    'display.html',
    'enlua.html',
    'env.html',
    'favicon.ico',
    'favicon.png',
    'fonts.html',
    'gps.html',
    'graphic.html',
    'gui.html',
    'highlight.css',
    'highlight.js',
    'holoprojector.html',
    'image.html',
    'index.html',
    'inertialEngine.html',
    'json.html',
    'keyboard.html',
    'lag_policy.html',
    'led.html',
    'libraries.html',
    'making_addons.html',
    'manifest.json',
    'midi.html',
    'minimap_component.html',
    'motor.html',
    'nbs.html',
    'objs.html',
    'onlineBoombox.html',
    'paint.html',
    'pistonController.html',
    'port.html',
    'preview.png',
    'radar.html',
    'radarDetector.html',
    'ramfs.html',
    'rom.html',
    'safeSmEnv.html',
    'service-worker.js',
    'style.css',
    'styles.html',
    'syntax.html',
    'synthesizer.html',
    'terminal.html',
    'timer.html',
    'utf8.html',
    'utils.html',
    'vdisplay.html',
    'wasd.html',
    'xEngine.html'
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
