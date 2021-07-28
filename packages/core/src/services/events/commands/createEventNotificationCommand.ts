import { Event } from '@prisma/client';

import { prisma } from '@toolkits';
import { notificationService } from '@services';
import { logger } from '@logger';

export const createEventNotificationCommand = async (event: Event): Promise<void> => {
  // Find the event notification settings
  const settings = await prisma.notificationEventSettings.findUnique({
    where: {
      onEvent: event.type
    }
  });

  if (!settings || !settings.active) {
    logger.info('Skipping notification creation for event');

    return;
  }

  let userIds: string[] = [];

  // Foreach of the notification settings find the required users
  if (settings.sendToEveryone) {
    const users = await prisma.user.findMany({
      select: {
        id: true
      }
    });

    // Extract only the IDs
    userIds = users.map(u => u.id);
  }

  if (settings.sendToCommon) {
    if (event.commonId) {
      const users = await prisma.user.findMany({
        where: {
          memberships: {
            some: {
              commonId: event.commonId
            }
          }
        },
        select: {
          id: true
        }
      });

      // Merge the user IDs
      userIds = Array.from(
        new Set([
          ...userIds,
          ...users.map(u => u.id)
        ])
      );
    } else {
      logger.error(
        'Cannot create notifications on event for all common members ' +
        'because the event does not have linked common', {
          event,
          settings
        });
    }
  }

  if (settings.sendToUser) {
    if (event.userId) {
      const user = await prisma.user.findUnique({
        where: {
          id: event.userId
        }
      });

      if (user) {
        // Add the user to the array
        userIds = Array.from(
          new Set([
            ...userIds,
            user.id
          ])
        );
      }
    } else {
      logger.error(
        'Cannot create notifications on event for user ' +
        'because the event is not linked to user', {
          event,
          settings
        });
    }
  }


  // Create the notification for each of the required users
  const notificationCreationPromises: Promise<any>[] = [];

  for (const userId of userIds) {
    notificationCreationPromises.push(
      notificationService.create({
        type: settings.sendNotificationType,
        userId: userId,
        connect: {
          discussionId: event.discussionId || undefined,
          proposalId: event.proposalId || undefined,
          payoutId: event.payoutId || undefined,
          commonId: event.commonId || undefined
        }
      })
    );
  }

  await Promise.all(notificationCreationPromises);
};