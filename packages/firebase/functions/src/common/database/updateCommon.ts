import { ICommonEntity } from '@common/types';
import { firestore } from 'firebase-admin';

import { CommonsCollection } from './index';

export type IUpdatableCommonEntity = Partial<ICommonEntity> & {
  id: string;
}

/**
 * Updates the common in the backing store
 *
 * @param common - The updated common
 */
export const updateCommon = async (common: IUpdatableCommonEntity): Promise<IUpdatableCommonEntity> => {
  const commonEntity: IUpdatableCommonEntity = {
    ...common,

    updatedAt: firestore.Timestamp.now()
  };

  await CommonsCollection
    .doc(commonEntity.id)
    .update(commonEntity);

  return commonEntity;
}