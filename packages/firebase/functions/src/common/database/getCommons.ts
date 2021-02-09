import { ICommonEntity } from '@common/types';
import admin from 'firebase-admin';

import { CommonsCollection } from './index';
import QuerySnapshot = admin.firestore.QuerySnapshot;
import { CommonError } from '../../util/errors';

interface IGetCommonsOptions {
  commonId?: string;

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
}

/**
 * Returns array of all commons matching the criteria
 *
 * @param options - List of params that all of the returned common must match
 */
export const getCommons = async (options: IGetCommonsOptions): Promise<ICommonEntity[]> => {
  let commonsQuery: any = CommonsCollection;

  if (options.commonId) {
    commonsQuery = commonsQuery.where('id', '==', options.commonId);
  }

  // Sorting and paging
  if (options.first || options.last) {
    const { first, last, after } = options;

    if (first && last) {
      throw new CommonError('Only first or only last can be selected, not both!');
    }

    if (first) {
      commonsQuery = commonsQuery
        .orderBy('createdAt', 'asc')
        .limit(first);
    }

    if (last) {
      commonsQuery = commonsQuery
        .orderBy('createdAt', 'desc')
        .limit(last);
    }

    if (after) {
      commonsQuery = commonsQuery
        .offset(after);
    }
  }

  return (await commonsQuery.get() as QuerySnapshot<ICommonEntity>)
    .docs.map(x => x.data());
};