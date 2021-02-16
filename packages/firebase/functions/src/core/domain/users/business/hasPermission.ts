import { userDb } from '../database';

const permissions = ['founder', 'moderator'];

export const hasPermission = async (userId: string, commonId: string): Promise<boolean> =>  {
	const user = await userDb.get(userId);
  // TODO add condition for older commons which users don't have founder role to
  user.roles.forEach((role) => {
    if (commonId === role.data.commonId &&  permissions.includes(role.role)) {
      return true;
    }
  });
  return false;
}