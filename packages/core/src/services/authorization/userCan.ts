import * as z from 'zod';

import { logger } from '@logger';
import { prisma } from '@toolkits';
import { PermissionValidator } from '@validation';

export const userCan = async (userId: string, permission: z.infer<typeof PermissionValidator>): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      permissions: true
    }
  });

  if (!user) {
    logger.debug('User cannot because it was not found', {
      userId
    });

    return false;
  }

  const can = user.permissions.includes(permission);

  logger.debug(`User ${can ? 'has' : 'does not have'} "${permission}" permission`);

  return can;
};