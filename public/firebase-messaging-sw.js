/* eslint-disable */
// firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js",
);

const ENV = {
  LOCAL: "http://localhost:3000",
  DEV: "https://web-dev.common.io",
  STAGE: "https://web-staging.common.io",
  PRODUCTION: "https://common.io",
};

const FIREBASE_CONFIG_ENV = {
  DEV: {
    apiKey: "AIzaSyDbTFuksgOkIVWDiFe_HG7-BE8X6Dwsg-0",
    authDomain: "common-dev-34b09.firebaseapp.com",
    databaseURL: "https://common-dev-34b09.firebaseio.com",
    projectId: "common-dev-34b09",
    storageBucket: "common-dev-34b09.appspot.com",
    messagingSenderId: "870639147922",
    appId: "1:870639147922:web:9ee954bb1dd52e25cb7f4b",
  },
  STAGE: {
    apiKey: "AIzaSyBASCWJMV64mZJObeFEitLmdUC1HqmtjJk",
    authDomain: "common-staging-1d426.firebaseapp.com",
    databaseURL: "https://common-staging-1d426.firebaseio.com",
    projectId: "common-staging-1d426",
    storageBucket: "common-staging-1d426.appspot.com",
    messagingSenderId: "701579202562",
    appId: "1:701579202562:web:5729d8a875f98f6709571b",
  },
  PRODUCTION: {
    apiKey: "AIzaSyAlYrKLd6KNKVkhmNEMKfb0cWHSWicCBOY",
    authDomain: "common-production-67641.firebaseapp.com",
    databaseURL: "https://common-production-67641.firebaseio.com",
    projectId: "common-production-67641",
    storageBucket: "common-production-67641.appspot.com",
    messagingSenderId: "461029494046",
    appId: "1:461029494046:web:4e2e4afbbeb7b487b48d0f",
  },
};

let firebaseConfig = {};

switch (location.origin) {
  case ENV.LOCAL:
  case ENV.DEV: {
    firebaseConfig = FIREBASE_CONFIG_ENV.DEV;
    break;
  }
  case ENV.STAGE: {
    firebaseConfig = FIREBASE_CONFIG_ENV.STAGE;
    break;
  }
  case ENV.PRODUCTION: {
    firebaseConfig = FIREBASE_CONFIG_ENV.PRODUCTION;
    break;
  }
  default: {
    firebaseConfig = FIREBASE_CONFIG_ENV.DEV;
    break;
  }
}

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    data: payload.data,
    icon: "/logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
