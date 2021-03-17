import { auth } from 'firebase-admin';
import { ExpressContext } from 'apollo-server-express';

import { userService } from '@services';

export interface IRequestContext {
  /**
   * Get the authenticated user authId or throw an error
   * if no user is authenticated
   */
  getUserAuthId: () => Promise<string>;

  /**
   * Get the authenticated user ID or throw an error
   * if no user is authenticated
   */
  getUserId: () => Promise<string>;

  /**
   * Get the authenticated user decoded token payload
   * or throw an error if no user is authenticated
   */
  getUserDecodedToken: () => Promise<auth.DecodedIdToken>;
}

export const createRequestContext = ({ req }: ExpressContext): IRequestContext => {
  return {
    getUserId: async () => {
      // @todo Use custom method for that
      return userService.queries.getId({
        authId: (await auth().verifyIdToken(req.headers.authorization)).uid
      });
    },


    getUserAuthId: async () => {
      // @todo Use custom method for that
      return (await auth().verifyIdToken(req.headers.authorization)).uid;
    },

    getUserDecodedToken: async () => {
      // @todo Use custom method for that
      return (await auth().verifyIdToken(req.headers.authorization));
    }
  };
};