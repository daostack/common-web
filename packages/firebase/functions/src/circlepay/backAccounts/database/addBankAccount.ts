import { SharedOmit } from '@common/types';
import { firestore } from 'firebase-admin';
import { v4 } from 'uuid';

import { BaseEntityType } from '../../../util/types';

import { IBankAccountEntity } from '../types';
import { BankAccountCollection } from './index';

/**
 * Prepares the passed bank account for saving and saves it. Please note that
 * there is *no* validation being done here. *Do not use directly!*
 *
 * @param bankAccount - the bankAccount to be saved
 */
export const addBankAccount = async (bankAccount: SharedOmit<IBankAccountEntity, BaseEntityType>): Promise<IBankAccountEntity> => {
  const bankAccountDoc: IBankAccountEntity = {
    id: v4(),

    createdAt: firestore.Timestamp.now(),
    updatedAt: firestore.Timestamp.now(),

    ...bankAccount
  };

  if (process.env.NODE_ENV === 'test') {
    bankAccountDoc['testCreated'] = true;
  }

  await BankAccountCollection
    .doc(bankAccountDoc.id)
    .set(bankAccountDoc);

  return bankAccountDoc;
};