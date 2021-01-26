import { firestore } from 'firebase-admin';

import { ICommonEntity } from '../types';
import { CommonsCollection } from './index';

/**
 * Updates the common in the backing store
 *
 * @param common - The updated common
 */
export const updateCommon = async (common: ICommonEntity): Promise<ICommonEntity> => {
  const commonEntity = {
    ...common,

    updatedAt: firestore.Timestamp.now()
  };

  await CommonsCollection
    .doc(commonEntity.id)
    .update(commonEntity);

  return commonEntity;
}