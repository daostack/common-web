import * as z from 'zod';

import { logger } from '@logger';
import { prisma } from '@toolkits';
import { PermissionValidator } from '@validation';
import { allPermissions } from '../../domain/validation/permissions';

const userCanValidator =
  z.object({
    and: z.array(PermissionValidator)
      .optional(),

    or: z.array(PermissionValidator)
      .optional()
  });

type Check = typeof allPermissions[number] | {
  or?: (typeof allPermissions[number])[],
  and?: (typeof allPermissions[number])[]
}

export const userCan = async (userId: string, check: Check): Promise<boolean> => {
  const permissions = await getUserPermissions(userId);

  let can = false;

  if (typeof check === 'string') {
    can = permissions.includes(check);

    logger.debug(`User ${can ? 'has' : 'does not have'} "${check}" permission`);
  } else if (typeof check === 'object') {
    if (check.and?.length) {
      can = check.and.every((p: string) => permissions.includes(p));

      logger.debug(`User ${can ? 'has' : 'does not have'} all "${check.and.join(', ')}" permissions`);
    } else if (check.or?.length) {
      can = check.or.some((p: string) => permissions.includes(p));

      logger.debug(`User ${can ? 'has' : 'does not have'} some of "${check.or.join(', ')}" permissions`);
    }
  }

  return can;
};


const getUserPermissions = async (userId: string): Promise<string[]> => {
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

    return [];
  }

  return user.permissions;
};