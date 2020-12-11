import { v4 } from 'uuid';
import admin from 'firebase-admin';
import Timestamp = admin.firestore.Timestamp;

import { BaseEntityType, SharedOmit } from '../../../util/types';

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

    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),

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