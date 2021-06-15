import admin from 'firebase-admin';
import axios from 'axios';

import { CommonError } from '@errors';

/**
 * Gets the ID token for the user with the specified uid.
 * Does not work in environment different than dev!
 *
 * @param uid - The id of the user for whom we what ID token
 */
export const getUserIdTokenQuery = async (uid: string): Promise<string> => {
  if (process.env.Environment !== 'dev') {
    throw new CommonError('Cannot get ID token in environment that is not dev');
  }

  const customToken = await admin
    .auth()
    .createCustomToken(uid);

  const res = await axios.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${process.env['FIREBASE_API_KEY']}`, {
    token: customToken,
    returnSecureToken: true
  });

  return res.data.idToken;
};