import { IUserEntity } from '@common/types';

import { ArgumentError, NotFoundError } from '../../../util/errors';
import { UserCollection } from './index';

/**
 * Tries to find the user by provided user ID
 *
 * @throws { ArgumentError } - if the passed userId is with falsy value
 * @throws { NotFoundError } - if the user is not found
 *
 * @param userId - The userId of the user we want to find
 */
export const getUser = async (userId: string): Promise<IUserEntity> => {
  if (!userId) {
    throw new ArgumentError('userId', userId);
  }

  const user = await UserCollection
    .doc(userId)
    .get();

  if (!user.exists) {
    throw new NotFoundError('user.userId', userId);
  }

  return user.data();
};