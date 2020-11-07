import admin from 'firebase-admin';
import rp from 'request-promise';

import { env } from '../constants';

/**
 * Creates JWT for the provided user ID. Use with caution
 * as this gives real JWT for that user
 *
 * @param uid - the id of the user
 */
export const getAuthToken = async (uid: string) => {
  const customToken = await admin.auth().createCustomToken(uid);

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