// Service Worker for "أنوار الوحي" Quran Application
const CACHE_NAME = 'anwar-alwahy-v1.5.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/privacy.html',
  '/manifest.json',
  '/favicon.svg',
  '/favicon.png',
  '/icon-96.png',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable.png',
  '/apple-touch-icon.png',
  '/screenshot-mobile.png',
  '/screenshot-desktop.png',
  '/quran-uthmani.json',
  '/adhan-makkah.mp3',
  '/adhan-madinah.mp3',
  '/adhan-abdulbasit.mp3',
  '/adhan-egypt.mp3'
];

// Install Event - Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Some static assets failed to pre-cache:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up previous cache versions
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

// Handle Background Push & Scheduled Notifications
self.addEventListener('push', (event) => {
  let data = { title: 'حان موعد الصلاة 🕌', body: 'حي على الصلاة، حي على الفلاح', icon: '/icon-192.png' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }
  const options = {
    body: data.body,
    icon: data.icon || '/icon-192.png',
    badge: '/icon-96.png',
    vibrate: [200, 100, 200, 100, 300],
    data: { url: '/' },
    actions: [
      { action: 'open', title: 'فتح التطبيق' },
      { action: 'close', title: 'إغلاق' }
    ]
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification Click Event - Focus or open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'close') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Fetch Event - Stale While Revalidate / Cache First for static & Network First for dynamic
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and Firebase/Analytics/Audio streaming endpoints
  if (request.method !== 'GET') return;
  if (url.origin.includes('firebaseio.com') || url.origin.includes('googleapis.com')) return;

  // For Fonts & Static Images: Cache-First
  if (
    url.origin.includes('fonts.googleapis.com') ||
    url.origin.includes('fonts.gstatic.com') ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        }).catch(() => caches.match('/favicon.svg'));
      })
    );
    return;
  }

  // For Navigation / HTML pages & Scripts: Network First with Cache Fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && request.url.startsWith('http')) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      })
  );
});
