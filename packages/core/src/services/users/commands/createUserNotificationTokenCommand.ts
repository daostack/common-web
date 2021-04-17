import * as z from 'zod';
import { UserNotificationToken, UserNotificationTokenState } from '@prisma/client';

import { logger } from '@logger';
import { prisma } from '@toolkits';
import { CommonError } from '@errors';

const schema = z.object({
  userId: z.string()
    .nonempty(),

  token: z.string()
    .nonempty(),

  description: z.string()
    .nonempty()
});

export const createUserNotificationTokenCommand = async (payload: z.infer<typeof schema>): Promise<UserNotificationToken> => {
  // Validate the payload
  schema.parse(payload);

  logger.debug('Creating user notification token from valid payload');

  // Check how many active notification tokens user has
  const activeUserTokensCount = await prisma.userNotificationToken.count({
    where: {
      userId: payload.userId,
      state: UserNotificationTokenState.Active
    }
  });

  if (activeUserTokensCount >= 10) {
    throw new CommonError(
      'User cannot have more than 10 active notification tokens. To add ' +
      'new tokens, please deactivate or delete some of the old ones!', {
        userId: payload.userId
      });
  }

  // Create the token
  const notificationToken = await prisma.userNotificationToken.create({
    data: {
      userId: payload.userId,

      token: payload.token,
      description: payload.description
    }
  });

  logger.debug('Notification token successfully created', {
    notificationTokenId: notificationToken.id
  });

  // @todo Setup the token expiration

  // Return the token
  return notificationToken;
};