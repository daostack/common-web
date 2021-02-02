import { ICommonEntity } from '@common/types';

import { CommonError } from '../../util/errors';


/**
 * Check if the user is part of the common
 *
 * @param common - The common in witch to check
 * @param userId - The id of the user that we want to check
 *
 * @param throws - Whether to throw error if the user is not part of the common (Default is false)
 *
 * @throws { CommonError } - If the user is not part of the common and the *throws* param is `true`
 */
export const isCommonMember = (common: ICommonEntity, userId: string, throws = false): boolean => {
  if (!common.members.find(member => member.userId === userId)) {
    if (throws) {
      throw new CommonError(`User (${userId}) is not part of common (${common})`);
    } else {
      return false;
    }
  }

  return true;
};
