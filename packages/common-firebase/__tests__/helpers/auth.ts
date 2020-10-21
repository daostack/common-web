import * as admin from 'firebase-admin';
import axios from 'axios';

import { env } from './env';

export const getIdToken = async (uid: string): Promise<string> => {
  const customToken = await admin.auth().createCustomToken(uid);

  const res = await axios.post(
    `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${env.firebaseToken}`,
    {
      token: customToken,
      returnSecureToken: true
    }
  );

  return res.data.idToken;
};