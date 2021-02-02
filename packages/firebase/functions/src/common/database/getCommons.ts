import { ICommonEntity } from '@common/types';
import admin from 'firebase-admin';

import { CommonsCollection } from './index';
import QuerySnapshot = admin.firestore.QuerySnapshot;

interface IGetCommonsOptions {
  commonId?: string;
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

  return (await commonsQuery.get() as QuerySnapshot<ICommonEntity>)
    .docs.map(x => x.data());
};