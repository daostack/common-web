import admin from 'firebase-admin';

import { adminKeys, env } from './constants';

export const databaseURL = env.firebase.databaseURL;
export const circlePayApi = env.circlepay.apiUrl;


admin.initializeApp({
  credential: admin.credential.cert(adminKeys as unknown as string),
  databaseURL
});

export const db = admin.firestore();

db.settings({
  ignoreUndefinedProperties: true
});

// @todo Move to constants
export const PROPOSAL_TYPE = {
  Join: 'Join',
  FundingRequest: 'FundingRequest'
};