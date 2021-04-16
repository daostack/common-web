import * as z from 'zod';
import { UserNotificationToken } from '@prisma/client';

import { logger } from '@logger';
import { prisma } from '@toolkits';

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

  // Create the token
  const notificationToken = await prisma.userNotificationToken.create({
    data: {
      userId: payload.userId,

      token: payload.token,
      description: payload.description
    }
  });

  // @todo Setup the token expiration

  // Return the token
  return notificationToken;
};