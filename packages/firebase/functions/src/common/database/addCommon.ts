import { v4 } from 'uuid';
import { firestore } from 'firebase-admin';

import { ICommonEntity } from '@common/types';

import { BaseEntityType } from '../../util/types';

import { CommonsCollection } from './index';


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

    createdAt: firestore.Timestamp.fromDate(new Date()),
    updatedAt: firestore.Timestamp.fromDate(new Date()),

    raised: 0,
    balance: 0,

    ...common
  };

  if(process.env.NODE_ENV === 'test') {
    commonDoc['testCreated'] = true;
  }

  await CommonsCollection
    .doc(commonDoc.id)
    .set(commonDoc);

  return commonDoc;
};