import * as admin from 'firebase-admin';
import rp from 'request-promise';

import { env } from './env';

export const getAuthToken = async (userId: string) => {
  const customToken = await admin.auth().createCustomToken(userId);

  const res = await rp({
    url: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${env.firebase.apiKey}`,
    method: 'POST',
    body: {
      token: customToken,
      returnSecureToken: true
    },
    json: true
  });

  return res.idToken;
};