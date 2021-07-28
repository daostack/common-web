import { prisma } from '@toolkits';
import { rebuildUserPermissionsCommand } from './rebuildUserPermissionsCommand';
import { logger as $logger } from '@logger';

export const removeUserFromRoleCommand = async (userId: string, roleId: string): Promise<void> => {
  const logger = $logger.child({
    userId,
    roleId
  });

  // Unlink the user from the roles
  logger.debug('Removing user from roles');

  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      roles: {
        disconnect: {
          id: roleId
        }
      }
    }
  });

  logger.info('User removed from roles');

  // Rebuild the user permissions
  await rebuildUserPermissionsCommand(userId);
};