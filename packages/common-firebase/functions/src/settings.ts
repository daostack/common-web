import admin from 'firebase-admin';

import { adminKeys, env } from './constants';


// @todo Refactor for TypeScript
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

export const databaseURL = env.firebase.databaseURL;
export const circlePayApi = env.circlepay.apiUrl;


// if(process.env.NODE_ENV === 'test') {
//   process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
//
//   admin.initializeApp({
//     projectId: 'test',
//     credential: admin.credential.applicationDefault()
//   });
// } else {
  admin.initializeApp({
    credential: admin.credential.cert(adminKeys as unknown as string),
    databaseURL
  });
// }

export const db = admin.firestore();

db.settings({
  ignoreUndefinedProperties: true
});

// @todo Move to constants
export const PROPOSAL_TYPE = {
  Join: 'Join',
  FundingRequest: 'FundingRequest'
};
const secretClient = new SecretManagerServiceClient();

export const getSecret = async (secretName) => {
  const secret = `projects/${env.secretManagerProject}/secrets/${secretName}/versions/latest`;
  const [secretResult] = await secretClient.accessSecretVersion({name: secret})
  return secretResult.payload.data.toString();
};