import admin from 'firebase-admin';

import { adminKeys, env } from './constants';


// @todo Refactor for TypeScript
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

export const databaseURL = env.firebase.databaseURL;
export const circlePayApi = env.circlepay.apiUrl;

// let dbFn: any
let getSecretFn: (secretName: string) => Promise<string>;

if(process.env.NODE_ENV === 'test') {
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

  getSecretFn = (secretName: string): Promise<string> => Promise.resolve(secretName);

  admin.initializeApp({
    projectId: 'test',
    credential: admin.credential?.applicationDefault()
  });
} else {
  admin.initializeApp({
    credential: admin.credential.cert(adminKeys as unknown as string),
    databaseURL
  });

  const secretClient = new SecretManagerServiceClient();

  getSecretFn = async (secretName: string): Promise<any> => {
    const secret = `projects/${env.secretManagerProject}/secrets/${secretName}/versions/latest`;
    const [secretResult] = await secretClient.accessSecretVersion({ name: secret });
    return secretResult.payload.data.toString();
  };
}

export const db = admin.firestore();
export const getSecret = getSecretFn;

db.settings({
  ignoreUndefinedProperties: true
});