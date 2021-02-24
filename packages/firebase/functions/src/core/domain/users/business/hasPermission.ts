import { userDb } from '../database';
import { commonDb } from '../../../../common/database';

const permissions = ['founder', 'moderator']; // @discuss can we maybe have a `constants.ts` in each folder?

/**
 * Checks if a user has permissions for a certain common
 * @param userId    - the id of the user we want to check permissions
 * @param commonId  - the id of the common we want to check if the user has permission to
 * @return boolean  - true -> user has permission, otherwise -> false
 */
export const hasPermission = async (userId: string, commonId: string): Promise<boolean> =>  {
  const user = await userDb.get(userId);
  let permission = false;

  user.roles?.forEach((role) => {
    if (commonId === role.data.commonId && permissions.includes(role.role)) {
      permission = true
    }
  });

  // for older commons, users don't have their founder role, so checking if founder
  if (!permission) {
    const common = await commonDb.get(commonId);
    permission = common.metadata.founderId === userId;
  }

  return permission;
}