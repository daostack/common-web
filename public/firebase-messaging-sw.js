/* eslint-disable */
// firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js",
);

let firebaseConfig = {};

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "INIT_ENV") {
    firebaseConfig = event.data.env;
    initializeFirebase();
  }
});

function initializeFirebase() {
  if (firebaseConfig.apiKey) {
    firebase.initializeApp(firebaseConfig);

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        data: payload.data,
        icon: "/logo.png",
      };

      self.registration.showNotification(
        notificationTitle,
        notificationOptions,
      );
    });
  }
}
