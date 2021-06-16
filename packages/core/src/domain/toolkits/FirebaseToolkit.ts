import admin from 'firebase-admin';

import { logger } from '@logger';

export const InitializeFirebase = () => {


  if (!admin.apps.length) {
    logger.info('⚙️ Initializing Firebase Admin');

    if (!process.env['FIREBASE_PRIVATE_KEY']) {
      logger.error('Cannot find firebase private key');
    }

    // @ts-ignore
    const credential = admin.credential.cert({
      type: process.env['FIREBASE_TYPE'],
      project_id: process.env['FIREBASE_PROJECT_ID'],
      private_key_id: process.env['FIREBASE_PRIVATE_KEY_ID'],
      private_key: process.env['FIREBASE_PRIVATE_KEY'],
      client_email: process.env['FIREBASE_CLIENT_EMAIL'],
      client_id: process.env['FIREBASE_CLIENT_ID'],
      auth_uri: process.env['FIREBASE_AUTH_URI'],
      token_uri: process.env['FIREBASE_TOKEN_URI'],
      auth_provider_x509_cert_url: process.env['FIREBASE_AUTH_PROVIDER_X509_CERT_URL'],
      client_x509_cert_url: process.env['FIREBASE_CLIENT_X509_CERT_URL']
    } as any);

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