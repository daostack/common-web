import { prisma } from '@toolkits';
import { CommonError } from '@errors';
import { logger as $logger } from '@logger';
import { rebuildUserPermissionsCommand } from './rebuildUserPermissionsCommand';

export const addUserToRoleCommand = async (userId: string, roleId: string): Promise<void> => {
  const logger = $logger.child({
    userId,
    roleId
  });

  // Find the user and check if they are already in that roles
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
    throw new CommonError('Cannot add the user twice to the same roles', {
      userId,
      roleId
    });
  }

  // Link the user to the roles if they are not
  logger.debug('Linking user to roles');

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

  logger.info('User linked to roles');

  // Rebuild the permissions
  await rebuildUserPermissionsCommand(userId);
};