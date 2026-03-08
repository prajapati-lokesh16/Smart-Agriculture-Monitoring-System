/* global self */

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = { title: 'Notification', body: event.data.text() };
  }
  const { title, body, icon } = data;

  event.waitUntil(
    self.registration.showNotification(title || 'Alert', {
      body: body || '',
      icon: icon || '/icons/icon-192.png',
    })
  );
});

// handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});
