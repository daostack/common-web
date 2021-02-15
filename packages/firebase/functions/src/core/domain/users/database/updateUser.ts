import { ArgumentError } from '../../../../util/errors';

import { IUserEntity } from '@common/types';
import { UserCollection } from './index';

/**
* Update user doc with new doc
*
* @throws { ArgumentError } - if the passed userId is with falsy value
*
* @param userId - The userId of the user we want to find
* @param userDoc - The user doc with the new updates
*/
export const updateUser = async (userId: string, userDoc: IUserEntity): Promise<IUserEntity> => {
 if (!userId) {
   throw new ArgumentError('userId', userId);
 }

  await UserCollection
   .doc(userId)
   .update(userDoc);

  return userDoc;
}; 