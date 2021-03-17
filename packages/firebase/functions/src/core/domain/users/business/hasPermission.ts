import { commonDb } from '../../../../common/database';
import { PERMISSION } from '../../../../permissions/constants';

/**
 * Checks if a user has permissions for a certain common
 * @param userId    - the id of the user we want to check permissions
 * @param commonId  - the id of the common we want to check if the user has permission to
 * @return boolean  - indicating whether the user has permission or not
 */
export const hasPermission = async (userId: string, commonId: string): Promise<boolean> =>  {
  const common = await commonDb.get(commonId);
  const memberObj = common.members.find((member) => member.userId === userId);
  return (memberObj && memberObj?.permission === PERMISSION.moderator) || common.metadata.founderId === userId;
}