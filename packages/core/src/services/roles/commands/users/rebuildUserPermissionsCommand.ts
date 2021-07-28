import { User } from '@prisma/client';

import { logger } from '@logger';
import { prisma } from '@toolkits';
import { CommonError } from '@errors';

export const rebuildUserPermissionsCommand = async (userId: string): Promise<User> => {
  logger.debug(`Rebuilding roles for user (${userId})`, { userId });

  // Find the user and all roles they have
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      roles: {
        select: {
          permissions: true
        }
      }
    }
  });

  // Check if the user exists
  if (!user) {
    throw new CommonError('Cannot rebuild permissions for non existent user');
  }

  // Create the new permission that the use has to have
  const permissions = Array.from(
    new Set(...user.roles.map(r => r.permissions))
  );

  // Update the user permissions in the database
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      permissions
    }
  });

  // Log the permission difference
  const removedPermissions = user.permissions.filter(permission => !permission.includes(permission));
  const addedPermissions = permissions.filter(permission => !user.permissions.includes(permission));

  logger.info('User permission update report', {
    userId,
    addedPermissions,
    removedPermissions
  });

  // Return the updated user
  return updatedUser;
};