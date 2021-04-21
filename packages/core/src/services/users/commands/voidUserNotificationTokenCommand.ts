import { UserNotificationTokenState, EventType, UserNotificationToken } from '@prisma/client';

import { logger } from '@logger';
import { prisma } from '@toolkits';
import { eventService } from '@services';

/**
 * Voiding notification token of a user
 *
 * @param tokenId - The ID of the token to void
 */
export const voidUserNotificationTokenCommand = async (tokenId: string): Promise<UserNotificationToken> => {
  logger.info('Voiding user notification token', {
    tokenId
  });

  const token = await prisma.userNotificationToken.update({
    where: {
      id: tokenId
    },
    data: {
      state: UserNotificationTokenState.Voided
    }
  });

  eventService.create({
    type: EventType.UserNotificationTokenVoided,
    userId: token.userId
  });

  return token;
};