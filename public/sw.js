/**
 * Avero Marketplace - High Performance Progressive Web App Service Worker
 * Offline asset caching, fast shell loading & background sync resilience
 */

const CACHE_NAME = 'avero-pwa-v1.1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  '/favicon.ico'
];

// 1. Install Event: Pre-cache core shell resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Pre-cache partial warning:', err);
      });
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Network-first for dynamic API & Supabase; Stale-While-Revalidate for static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignore chrome-extension and non-HTTP requests
  if (!event.request.url.startsWith('http')) return;

  // Ignore cross-origin Supabase, Firebase Auth, and third-party APIs from aggressive caching
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('groq.com') ||
    url.hostname.includes('cloudinary.com') ||
    event.request.method !== 'GET'
  ) {
    return;
  }

  // Handle static assets & navigation
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and request is navigation, return cached index.html
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html') || cachedResponse;
          }
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});
