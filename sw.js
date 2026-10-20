// sw.js - Service Worker con Cache API

// 1. Definimos el nombre y la versión de la caché estática
const CACHE_NAME = 'devconnect-shell-v2';

// 2. Listamos todos los recursos estáticos esenciales que forman el App Shell
const LOCAL_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/manifest.json',
    '/images/icon-192x192.png',
    '/images/icon-512x512.png'
];

const EXTERNAL_ASSETS = [
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// FASE DE INSTALACIÓN: Guardando recursos estáticos
self.addEventListener('install', event => {
    console.log('SW: Guardando recursos estáticos en la caché...');

    // Esperamos a que la promesa de guardado se complete antes de finalizar la instalación
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        console.log('SW: Caché abierta con éxito:', CACHE_NAME);

        // Los archivos locales son imprescindibles para cargar la aplicación sin conexión.
        await cache.addAll(LOCAL_ASSETS);

        // Si un CDN falla, no debe impedir que se instale el App Shell local.
        await Promise.all(EXTERNAL_ASSETS.map(async url => {
            try {
                await cache.add(url);
            } catch (err) {
                console.warn('SW: No se pudo precargar un recurso externo:', url, err);
            }
        }));

        console.log('SW: Recursos del App Shell almacenados.');
        await self.skipWaiting();
    })().catch(err => {
        console.error('SW: Falló el almacenamiento en caché del App Shell:', err);
        throw err;
    }));
});

// FASE DE ACTIVACIÓN
self.addEventListener('activate', event => {
    console.log('SW: Activado y listo.');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => Promise.all(
                cacheNames
                    .filter(name => name.startsWith('devconnect-shell-') && name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            ))
            .then(() => self.clients.claim())
    );
});

// FASE FETCH (Escuchando peticiones)
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);

        if (cachedResponse) {
            console.log('SW: Sirviendo desde Caché', event.request.url);
            return cachedResponse;
        }

        const networkResponse = await fetch(event.request);
        if (networkResponse.ok || networkResponse.type === 'opaque') {
            try {
                await cache.put(event.request, networkResponse.clone());
            } catch (err) {
                console.warn('SW: No se pudo guardar el recurso en caché:', event.request.url, err);
            }
        }
        return networkResponse;
    })());
});