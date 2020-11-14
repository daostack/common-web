import { firestore } from 'firebase-admin';

import { ICommonEntity } from '../types';
import { commonCollection } from './index';

/**
 * Updates the common in the backing store
 *
 * @param common - The updated common
 */
export const updateCommon = async (common: ICommonEntity): Promise<ICommonEntity> => {
  const commonEntity = {
    ...common,

    updatedAt: firestore.Timestamp.fromDate(new Date())
  };

  await commonCollection
    .doc(commonEntity.id)
    .update(commonEntity);

  return commonEntity;
}