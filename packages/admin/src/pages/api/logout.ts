import { NextApiRequest, NextApiResponse } from 'next';
import { unsetAuthCookies } from 'next-firebase-auth';

import initAuth from '../../helpers/authHelper';

initAuth();

const logoutHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('Attempting logout', req, res);

    await unsetAuthCookies(req, res);
  } catch (e) {
    console.error('Unexpected error occurred during the logout', e);

    return res
      .status(500)
      .json({
        error: 'Unexpected error occurred while logging out'
      });
  }

  return res
    .status(200)
    .json({
      message: 'Successfully logged out'
    });
};

export default logoutHandler;