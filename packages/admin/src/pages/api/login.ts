import { NextApiRequest, NextApiResponse } from 'next';
import { setAuthCookies } from 'next-firebase-auth';

import initAuth from '../../helpers/authHelper';

initAuth();

const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('Attempting authentication', req, res);

    await setAuthCookies(req, res);
  } catch (e) {
    console.error('Unexpected error occurred during the authentication', e);

    return res
      .status(500)
      .json({
        error: 'Unexpected error occurred while authenticating'
      });
  }

  return res
    .status(200)
    .json({
      message: 'Successfully authenticated'
    });
};

export default loginHandler;