import { IUserEntity } from '../types';
import { ArgumentError, CommonError, NotFoundError } from '../../../../util/errors';
import { UserCollection } from './index';

/**
 * Tries to find the user by provided email address
 *
 * @throws { ArgumentError } - if the passed email is with falsy value
 * @throws { NotFoundError } - if the user is not found
 * @throws { CommonError } - if more that one user is found
 *
 * @param email - The email of the user we want to find
 */
export const getUserByEmail = async (email: string): Promise<IUserEntity> => {
  if (!email) {
    throw new ArgumentError('email', email);
  }

  const user = await UserCollection
    .where('email', '==', email)
    .get();

  if (!user.docs.length) {
    throw new NotFoundError('user.email', email);
  }

  if (user.docs.length > 1) {
    throw new CommonError(`There are more than one user with the email ${email}`, {
      users: user.docs.map(u => u.data())
    });
  }

  return user.docs[0].data();
};