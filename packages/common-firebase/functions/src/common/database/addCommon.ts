import { v4 } from 'uuid';

import { ICommonEntity } from '../types';
import { commonCollection } from './index';


/**
 * Add the id to the passed common object and
 * saves it to the database
 *
 * @param common - The common that we want to save
 */
export const addCommon = async (common: Omit<ICommonEntity, 'id'>): Promise<ICommonEntity> => {
  const commonDoc: ICommonEntity = {
    id: v4(),
    ...common
  }

  await commonCollection.add(commonDoc);

  return commonDoc;
}