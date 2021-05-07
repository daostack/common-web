import { prisma } from '@toolkits';
import { CommonError } from '@errors';
import { logger as $logger } from '@logger';
import { rebuildUserPermissionsCommand } from './rebuildUserPermissionsCommand';

export const addUserToRoleCommand = async (userId: string, roleId: string): Promise<void> => {
  const logger = $logger.child({
    userId,
    roleId
  });

  // Find the user and check if they are already in that role
  const userRoles = await prisma.user
    .findUnique({
      where: {
        id: userId
      }
    })
    .roles({
      where: {
        id: roleId
      }
    });

  if (userRoles.length) {
    throw new CommonError('Cannot add the user twice to the same role', {
      userId,
      roleId
    });
  }

  // Link the user to the role if they are not
  logger.debug('Linking user to role');

  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      roles: {
        connect: {
          id: roleId
        }
      }
    },
    select: {
      id: true
    }
  });

  logger.info('User linked to role');

  // Rebuild the permissions
  await rebuildUserPermissionsCommand(userId);
};