import { firestore } from 'firebase-admin';

import { IBankAccountEntity } from '../types';
import { BankAccountCollection } from './index';


/**
 * Updates the passed entity in the database. Reference
 * is kept from the ID of the entity, so if the ID is changed (please,
 * don't do this) new entity will be created
 *
 * @param bankAccount - The bank account entity to update
 *
 * @returns - The updated bank account entity
 */
export const updateBankAccountInDatabase = async (bankAccount: IBankAccountEntity): Promise<IBankAccountEntity> => {
  const bankAccountDoc = {
    ...bankAccount,

    updatedAt: firestore.Timestamp.now()
  };

  logger.debug('Updating bank account', {
    bankAccount
  });

  await BankAccountCollection
    .doc(bankAccountDoc.id)
    .update(bankAccountDoc);

  return bankAccountDoc;
};