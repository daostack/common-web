import admin from 'firebase-admin';

import { logger } from '../utils/logger';
import { CommonError } from '../errors/index';

import adminKeys from '../constants/secrets/adminsdk-keys.json';

export const InitializeFirebase = () => {
  if (!adminKeys) {
    throw new CommonError('Firebase Admin keys are not present!');
  }

  if (!admin.apps.length) {
    logger.info('⚙️ Initializing Firebase Admin');

    // @ts-ignore
    const credential = admin.credential.cert(adminKeys);

    admin.initializeApp({
      credential
    });
  }
};