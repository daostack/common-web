import { auth } from 'firebase-admin';
import { PrismaClient } from '@prisma/client';
import { ExpressContext } from 'apollo-server-express';

import { prisma } from '@toolkits';
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

  /**
   * The prisma client
   */
  prisma: PrismaClient;
}

export const createRequestContext = ({ req }: ExpressContext): IRequestContext => {
  return {
    prisma,

    getUserId: async () => {
      // @todo Use custom method for that
      return userService.queries.getId({
        authId: (await auth().verifyIdToken(req.headers.authorization as string)).uid
      });
    },


    getUserAuthId: async () => {
      // @todo Use custom method for that
      return (await auth().verifyIdToken(req.headers.authorization as string)).uid;
    },

    getUserDecodedToken: async () => {
      // @todo Use custom method for that
      return (await auth().verifyIdToken(req.headers.authorization as string));
    }
  };
};