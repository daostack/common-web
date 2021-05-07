import { prisma } from '@toolkits';
import { rebuildUserPermissionsCommand } from './rebuildUserPermissionsCommand';
import { logger as $logger } from '@logger';

export const removeUserFromRoleCommand = async (userId: string, roleId: string): Promise<void> => {
  const logger = $logger.child({
    userId,
    roleId
  });

  // Unlink the user from the role
  logger.debug('Removing user from role');

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

  logger.info('User removed from role');

  // Rebuild the user permissions
  await rebuildUserPermissionsCommand(userId);
};