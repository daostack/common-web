import admin from 'firebase-admin';

import { adminKeys, env } from './constants';

const databaseURL = env.firebase.databaseURL;
const circlePayApi = env.circlepay.apiUrl;

if (env.environment === 'dev') {
  admin.initializeApp();
} else {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.stringify(adminKeys)),
    databaseURL: databaseURL
  });
}

const db = admin.firestore();

db.settings({
  ignoreUndefinedProperties: true
});

// @todo Move to constants
const PROPOSAL_TYPE = {
  Join: 'Join',
  FundingRequest: 'FundingRequest'
};

module.exports = {
  databaseURL,
  PROPOSAL_TYPE,
  circlePayApi,
  db
};
