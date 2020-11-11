import { v4 } from 'uuid';

import { BaseEntityType } from '../../util/types';

import { ICommonEntity } from '../types';
import { commonCollection } from './index';


type OmittedCommonCreationProperties = 'raised' | 'balance';

/**
 * Add the id to the passed common object and
 * saves it to the database
 *
 * @param common - The common that we want to save
 */
export const addCommon = async (common: Omit<ICommonEntity, BaseEntityType | OmittedCommonCreationProperties>): Promise<ICommonEntity> => {
  const commonDoc: ICommonEntity = {
    id: v4(),

    createdAt: new Date(),
    updatedAt: new Date(),

    raised: 0,
    balance: 0,

    ...common
  };

  await commonCollection
    .doc(commonDoc.id)
    .set(commonDoc);

  return commonDoc;
};