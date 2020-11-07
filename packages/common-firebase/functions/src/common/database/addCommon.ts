import { v4 } from 'uuid';

import { BaseEntityType } from '../../util/types';

import { ICommonEntity } from '../types';
import { commonCollection } from './index';


/**
 * Add the id to the passed common object and
 * saves it to the database
 *
 * @param common - The common that we want to save
 */
export const addCommon = async (common: Omit<ICommonEntity, BaseEntityType>): Promise<ICommonEntity> => {
  const commonDoc: ICommonEntity = {
    id: v4(),

    createdAt: new Date(),
    updatedAt: new Date(),

    ...common
  };

  await commonCollection
    .doc(commonDoc.id)
    .set(commonDoc);

  return commonDoc;
};