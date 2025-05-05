/* eslint-disable no-restricted-globals */

// This service worker can be customized further
// See https://developers.google.com/web/tools/workbox/modules

const CACHE_NAME = 'apple-music-charts-cache-v2';
const IMAGES_CACHE_NAME = 'apple-music-images-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.png',
  '/manifest.json'
];

// Install a service worker
self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Cache and return requests
self.addEventListener('fetch', (event) => {
  // Special handling for image requests
  if (event.request.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) || 
      event.request.url.includes('mzstatic.com')) {
    
    event.respondWith(
      caches.open(IMAGES_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          // Return cached image if available
          if (response) {
            return response;
          }
          
          // Otherwise fetch the image and cache it
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              // Clone the response before caching
              const clonedResponse = networkResponse.clone();
              cache.put(event.request, clonedResponse);
            }
            return networkResponse;
          }).catch((error) => {
            console.error('Error fetching image:', error);
            // Return a fallback image or just propagate the error
            throw error;
          });
        });
      })
    );
    return;
  }
  
  // Handle all other requests
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // Don't cache API responses
                if (!event.request.url.includes('api.allorigins.win') && 
                    !event.request.url.includes('rss.applemarketingtools.com')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      })
  );
});

// Update a service worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, IMAGES_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting outdated cache:', cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
  self.clients.claim();
});

// Cache management is handled automatically by the service worker
// The cache will be cleared when the service worker is updated