import { EventType } from '@prisma/client';

import { prisma } from '@toolkits';
import { eventService } from '@services';

/**
 * Delist the passed common. No authorization checks are being done here!
 *
 * @param commonId - The ID of the common to delist
 *
 * @returns - Whether the operation was successful
 */
export const delistCommonCommand = async (commonId: string): Promise<boolean> => {
  await prisma.common
    .update({
      where: {
        id: commonId
      },
      data: {
        whitelisted: {
          set: false
        }
      }
    });

  eventService.create({
    type: EventType.CommonDelisted,
    commonId
  });

  return true;
};