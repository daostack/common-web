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

    updatedAt: new Date()
  };

  await commonCollection
    .doc(commonEntity.id)
    .update(commonEntity);

  return commonEntity;
}