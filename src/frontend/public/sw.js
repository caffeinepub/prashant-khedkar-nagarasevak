/* Service Worker for Nagarasevak Khedkar - Push Notifications */

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'सूचना', body: '' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/assets/uploads/IMG-20260301-WA0009-1.jpg',
      badge: '/assets/uploads/IMG-20260301-WA0009-1.jpg',
      vibrate: [200, 100, 200],
      requireInteraction: true,
      tag: 'khedkar-notification',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing tab if open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});
