/**
 * sw.js - Service Worker do LocBUS (PWA)
 * Implementa cache inteligente para funcionamento offline, mapa offline resiliente e navegação instantânea.
 */

const CACHE_NAME = 'locbus-v2.2-cache';
const TILES_CACHE_NAME = 'locbus-map-tiles';

// Recursos essenciais do App Shell
const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/static/css/style.css',
  '/static/js/map.js',
  '/static/js/crowdsource.js',
  '/static/js/simulation.js',
  '/static/js/tabs.js',
  '/static/js/pwa.js',
  '/static/icons/icon.svg',
  '/static/icons/icon-192.png',
  '/static/icons/icon-512.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// 1. Instalação: Pré-carrega o App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pré-carregando App Shell do LocBUS...');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Aviso no precache inicial:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Ativação: Limpa versões antigas de cache e assume o controle de todos os clientes
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== TILES_CACHE_NAME) {
            console.log('[SW] Removendo cache obsoleto:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Estratégias de Interceptação de Requisições (Fetch)
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // A. Ignora métodos que não sejam GET
  if (req.method !== 'GET') {
    return;
  }

  // B. Ignora canal em tempo real SSE (/api/v1/events) para nunca sofrer cache
  if (url.pathname.includes('/api/v1/events')) {
    return;
  }

  // C. Map Tiles (CartoDB Basemap): Stale-While-Revalidate
  // Garante que o mapa viário não fica cinza nos pontos de parada com sinal instável
  if (url.hostname.includes('cartocdn.com') || url.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.open(TILES_CACHE_NAME).then(async (tileCache) => {
        const cached = await tileCache.match(req);
        const fetchPromise = fetch(req).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            tileCache.put(req, networkRes.clone());
          }
          return networkRes;
        }).catch(() => cached);

        return cached || fetchPromise;
      })
    );
    return;
  }

  // D. Endpoints de Dados da API (/api/v1/itinerary, /api/v1/history, /api/v1/status):
  // Network-First com Fallback para Cache
  if (url.pathname.startsWith('/api/v1/')) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;
          return new Response(JSON.stringify({ offline: true, message: 'Modo offline ativo.' }), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // E. App Shell e Arquivos Estáticos: Stale-While-Revalidate
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req).then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        }
        return networkRes;
      }).catch(() => {
        if (req.mode === 'navigate') {
          return caches.match('/');
        }
      });

      return cachedResponse || fetchPromise;
    })
  );
});
