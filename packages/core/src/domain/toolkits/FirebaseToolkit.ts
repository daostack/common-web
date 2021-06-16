import admin from 'firebase-admin';

import { logger } from '@logger';
import { CommonError } from '@errors';

export const InitializeFirebase = () => {
  if (
    !process.env['FIREBASE_CLIENT_EMAIL'] ||
    !process.env['FIREBASE_PRIVATE_KEY'] ||
    !process.env['FIREBASE_PROJECT_ID']
  ) {
    throw new CommonError('Firebase Admin keys are not present!');
  }

  if (!admin.apps.length) {
    logger.info('⚙️ Initializing Firebase Admin');

    // @ts-ignore
    const credential = admin.credential.cert({
      privateKey: process.env['FIREBASE_PRIVATE_KEY'],
      projectId: process.env['FIREBASE_PROJECT_ID'],
      clientEmail: process.env['FIREBASE_CLIENT_EMAIL']
    });

    admin.initializeApp({
      credential
    });
  }
};

export const messaging = (() => {
  InitializeFirebase();

  return admin.messaging();
})();

/**
 * @deprecated
 *
 * @todo Delete this :(
 */
export const getDb = () => admin.firestore();