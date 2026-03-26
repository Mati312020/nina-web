/**
 * Service Worker — Nina Web Push
 * Recibe notificaciones push del backend y las muestra al usuario.
 */

self.addEventListener('push', (event) => {
    if (!event.data) return;

    let payload;
    try {
        payload = event.data.json();
    } catch {
        payload = { title: 'Nina', body: event.data.text() };
    }

    const title   = payload.title || 'Nina';
    const options = {
        body:    payload.body || '',
        icon:    '/icon-192.png',
        badge:   '/icon-192.png',
        data:    payload.data || {},
        vibrate: [200, 100, 200],
    };

    event.waitUntil(self.registration.showNotification(title, options));
});


self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const data    = event.notification.data || {};
    const path    = data.path || '/';
    const baseUrl = self.location.origin;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
            const existing = list.find((c) => c.url.startsWith(baseUrl));
            if (existing) {
                existing.focus();
                return existing.navigate(baseUrl + path);
            }
            return clients.openWindow(baseUrl + path);
        })
    );
});
