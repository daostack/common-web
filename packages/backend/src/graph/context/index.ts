import { ExpressContext } from 'apollo-server-express';
import { auth } from 'firebase-admin';
import DecodedIdToken = auth.DecodedIdToken;

export interface IRequestContext {
  /**
   * Get the authenticated user ID or throw an error
   * if no user is authenticated
   */
  getUserAuthId: () => Promise<string>;

  /**
   * Get the authenticated user decoded token payload
   * or throw an error if no user is authenticated
   */
  getUserDecodedToken: () => Promise<DecodedIdToken>;
}

export const createRequestContext = ({ req }: ExpressContext): IRequestContext => {
  return {
    getUserAuthId: async () => {
      return (await auth().verifyIdToken(req.headers.authorization)).uid;
    },

    getUserDecodedToken: async () => {
      return (await auth().verifyIdToken(req.headers.authorization));
    }
  };
};