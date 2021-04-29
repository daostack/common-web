import { EventType } from '@prisma/client';

import { prisma } from '@toolkits';
import { eventService } from '@services';

/**
 * Whitelists the passed common. No authorization checks are being done here!
 *
 * @param commonId - The ID of the common to whitelist
 *
 * @returns - Whether the operation was successful
 */
export const whitelistCommonCommand = async (commonId: string): Promise<boolean> => {
  await prisma.common
    .update({
      where: {
        id: commonId
      },
      data: {
        whitelisted: {
          set: true
        }
      }
    });

  eventService.create({
    type: EventType.CommonWhitelisted,
    commonId
  });

  return true;
};