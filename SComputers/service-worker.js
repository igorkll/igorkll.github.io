const CACHE_NAME = '2';

const urlsToCache = [
    'SComputers/addons/Controllers.jpg',
    'SComputers/addons/minimap_component.jpg',
    'SComputers/addons/more_displays.jpg',
    'SComputers/addons/online_boombox.jpg',
    'SComputers/addons/power_toys.jpg',
    'SComputers/addons/stretchable_display.jpg',
    'SComputers/addons/world_disks.jpg',
    'SComputers/addons.html',
    'SComputers/antenna.html',
    'SComputers/api.html',
    'SComputers/base64.html',
    'SComputers/camera.html',
    'SComputers/cameraTunnel.html',
    'SComputers/chaff.html',
    'SComputers/colors.html',
    'SComputers/components.html',
    'SComputers/computer_data.html',
    'SComputers/contact_me.html',
    'SComputers/controllers.html',
    'SComputers/disk.html',
    'SComputers/display.html',
    'SComputers/enlua.html',
    'SComputers/env.html',
    'SComputers/favicon.ico',
    'SComputers/favicon.png',
    'SComputers/fonts.html',
    'SComputers/gps.html',
    'SComputers/graphic.html',
    'SComputers/gui.html',
    'SComputers/highlight.css',
    'SComputers/highlight.js',
    'SComputers/holoprojector.html',
    'SComputers/image.html',
    'SComputers/index.html',
    'SComputers/inertialEngine.html',
    'SComputers/json.html',
    'SComputers/keyboard.html',
    'SComputers/lag_policy.html',
    'SComputers/led.html',
    'SComputers/libraries.html',
    'SComputers/making_addons.html',
    'SComputers/manifest.json',
    'SComputers/midi.html',
    'SComputers/minimap_component.html',
    'SComputers/motor.html',
    'SComputers/nbs.html',
    'SComputers/objs.html',
    'SComputers/onlineBoombox.html',
    'SComputers/paint.html',
    'SComputers/pistonController.html',
    'SComputers/port.html',
    'SComputers/preview.png',
    'SComputers/radar.html',
    'SComputers/radarDetector.html',
    'SComputers/ramfs.html',
    'SComputers/rom.html',
    'SComputers/safeSmEnv.html',
    'SComputers/service-worker.js',
    'SComputers/style.css',
    'SComputers/styles.html',
    'SComputers/syntax.html',
    'SComputers/synthesizer.html',
    'SComputers/terminal.html',
    'SComputers/timer.html',
    'SComputers/utf8.html',
    'SComputers/utils.html',
    'SComputers/vdisplay.html',
    'SComputers/wasd.html',
    'SComputers/xEngine.html'
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
