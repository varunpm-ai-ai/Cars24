importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAd7f4oQ5Aw0fW1dZ2a8O5Qp7VexauWE7o",
  authDomain: "cars24-c182f.firebaseapp.com",
  projectId: "cars24-c182f",
  storageBucket: "cars24-c182f.firebasestorage.app",
  messagingSenderId: "715449567619",
  appId: "1:715449567619:web:9f1c677674ecd11d16ceb6",
  measurementId: "G-6XZLENVR4E"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background push notification: ', payload);
  
  const notificationTitle = payload.notification?.title || payload.data?.title || 'Cars24 Notification';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'You have a new update from Cars24.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data || {},
    tag: payload.data?.eventType || 'cars24-push-notification'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.', event.notification);
  event.notification.close();

  const clickUrl = event.notification.data?.url || '/profile/notifications';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(clickUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(clickUrl);
      }
    })
  );
});
