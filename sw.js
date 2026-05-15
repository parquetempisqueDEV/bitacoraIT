// Service Worker para Bitácora IT — Parque Tempisque
// Maneja la recepción de notificaciones push y el click sobre ellas

const LOGO_URL = 'https://vr506.com/assets/logo%20pt.png';

self.addEventListener('install', (event) => {
  // Activar inmediatamente sin esperar pestañas viejas
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Tomar control de las páginas abiertas
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'Bitácora IT', body: event.data ? event.data.text() : 'Tenés un recordatorio' };
  }

  const titulo = data.title || 'Bitácora IT';
  const opciones = {
    body: data.body || 'Tenés un recordatorio pendiente',
    icon: LOGO_URL,
    badge: LOGO_URL,
    tag: data.tag || 'bitacora-it-' + Date.now(),
    renotify: true,
    requireInteraction: true,
    data: {
      url: data.url || '/',
      notaId: data.notaId || null
    }
  };

  event.waitUntil(self.registration.showNotification(titulo, opciones));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si ya hay una pestaña abierta, enfocarla
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      // Si no, abrir una nueva
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
