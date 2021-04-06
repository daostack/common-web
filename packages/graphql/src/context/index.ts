import { auth } from 'firebase-admin';
import { PrismaClient } from '@prisma/client';
import { ExpressContext } from 'apollo-server-express';

import { prisma } from '@common/core';
import { Express } from 'express';

export interface IRequestContext {
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

  /**
   * The express request object
   */
  req: Express.Request;

  /**
   * The express response object
   */
  res: Express.Response;
}

export const createRequestContext = ({ req, res }: ExpressContext): IRequestContext => {
  return {
    req,
    res,
    prisma,

    getUserId: async () => {
      // @todo Use custom method for that
      return (await auth().verifyIdToken(req.headers.authorization as string)).uid;
    },

    getUserDecodedToken: async () => {
      // @todo Use custom method for that
      return (await auth().verifyIdToken(req.headers.authorization as string));
    }
  };
};