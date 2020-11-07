import { CommonError } from '../../util/errors';

import { commonDb } from '../database';

/**
 * Check if the user is part of the common
 *
 * @param commonId - The id of the common in witch to check
 * @param userId - The id of the user that we want to check
 * @param throws - Whether to throw error if the user is not part of the common (Default is false)
 *
 * @throws { CommonError } - If the user is not part of the common and the *throws* param is `true`
 */
export const isCommonMember = async (commonId: string, userId: string, throws = false): Promise<boolean> => {
  const common = await commonDb.getCommon(commonId);

  if (!common.members.find(member => member.userId === userId)) {
    if (throws) {
      throw new CommonError(`User (${userId}) is not part of common (${commonId})`);
    } else {
      return false;
    }
  }

  return true;
};
