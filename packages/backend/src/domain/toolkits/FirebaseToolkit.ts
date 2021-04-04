import admin from 'firebase-admin';

import adminKeys from '../secrets/adminsdk-keys.json';

export const InitializeFirebase = () => {
  if (!admin.apps.length) {
    console.info('⚙️ Initializing Firebase Admin');

    // @ts-ignore
    const credential = admin.credential.cert(adminKeys);

    admin.initializeApp({
      credential
    });
  }
};