import { firestore } from 'firebase-admin';

import { IUserEntity } from '@common/types';

import { CommonError } from '../../../../util/errors';

import { UserCollection } from './index';

export interface IGetUsersOptions {
  /**
   * Get the users for the ids. If the ID is not found no error will be thrown!
   */
  ids?: string[];

  /**
   * Get the last {number} of elements sorted
   * by createdAt date
   */
  last?: number;

  /**
   * Get the first {number} of elements sorted
   * by createdAt date
   */
  first?: number;

  /**
   * If sorting skip {number} elements
   */
  after?: number;

  sortByAsc?: string;
  sortByDesc?: string;
}

/**
 * Returns array of all votes casted to the user
 *
 * @param options - List of params that all of the returned user must match
 */
export const getUsers = async (options: IGetUsersOptions): Promise<IUserEntity[]> => {
  let usersQuery: firestore.Query<IUserEntity> = UserCollection;

  // Validators and warners
  if(options.sortByAsc && options.sortByDesc) {
    logger.warn('Both sorting options are selected');
  }

  if (options.ids) {
    usersQuery = usersQuery.where('id', 'in', options.ids);
  }

  if(options.sortByDesc) {
    usersQuery = usersQuery
      .orderBy(options.sortByDesc, 'desc');
  }

  if(options.sortByAsc) {
    usersQuery = usersQuery
      .orderBy(options.sortByAsc, 'asc');
  }

  // Sorting and paging
  if (options.first || options.last) {
    const { first, last, after } = options;

    if(!options.sortByAsc && !options.sortByDesc) {
      usersQuery = usersQuery
        .orderBy('createdAt', 'desc');
    }

    if (first && last) {
      throw new CommonError('Only first or only last can be selected, not both!');
    }

    if (first) {
      usersQuery = usersQuery
        .limit(first);
    }

    if (last) {
      usersQuery = usersQuery
        .limit(last);
    }

    if (after && after > 0) {
      usersQuery = usersQuery
        .offset(after);
    }
  }

  return (await usersQuery.get() as firestore.QuerySnapshot<IUserEntity>)
    .docs.map(x => x.data());
};