import { RequestHandler } from 'express';
import { auth } from 'firebase-admin';

import { CommonError, UnauthorizedError } from '../errors';
import { ErrorCodes, StatusCodes } from '../../constants';
import { getAuthToken } from '../getAuthToken';

export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    if (!req.headers.authorization || typeof req.headers.authorization !== 'string') {
      throw new UnauthorizedError();
    }

    try {
      // Use firebase-admin auth to verify the token passed in from the client header.
      // Decoding this token returns the userPayload and all the other token
      // claims you added while creating the custom token and adds them
      // to the express request object so they are easily accessible
      // from everywhere
      req.user = await auth().verifyIdToken(req.headers.authorization);

      return next();

    } catch (error) {
      throw new CommonError('An error occurred while authenticating the user', {
        userMessage: 'An error occurred during the authentication. Please log out and sign in again!',

        errorCode: ErrorCodes.AuthenticationError,
        statusCode: StatusCodes.Unauthorized,

        error,
        errorString: JSON.stringify(error)
      });
    }
  } catch (e) {
    // Use this only for development purposed. It SHOULD NOT
    // be committed uncommented

    // console.log(await getAuthToken('H5ZkcKBX5eXXNyBiPaph8EHCiax3'));

    return next(e);
  }
};