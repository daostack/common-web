import { PERMISSION } from '../../permissions/constants';
import { commonDb } from '../database';

export const getCommonModerators = async (commonId: string): Promise<string[]> => {
  const common = await commonDb.get(commonId);

  const moderators = common.members
    .filter((member) => member.permission === PERMISSION.moderator)
    .map((member) => member.userId);
  moderators.push(common.metadata.founderId);
  return moderators;
}