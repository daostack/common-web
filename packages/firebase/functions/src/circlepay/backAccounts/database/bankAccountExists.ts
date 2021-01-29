import admin from 'firebase-admin';
import { IBankAccountEntity } from '../types';
import { BankAccountCollection } from './index';


import DocumentSnapshot = admin.firestore.DocumentSnapshot;

interface IBankAccountExistsArgs {
  id?: string;
  iban?: string;
}

/**
 * Checks if bankAccount exists by one of the
 * bankAccounts unique properties
 *
 * @param args - Arguments against we will check
 */
export const bankAccountExists = async (args: IBankAccountExistsArgs): Promise<boolean> => {
  let bankAccount: DocumentSnapshot<IBankAccountEntity>;

  if (args.id) {
    bankAccount = (await BankAccountCollection.doc(args.id).get()) as DocumentSnapshot<IBankAccountEntity>;
  }

  if (args.iban) {
    const where = await BankAccountCollection.where('iban', '==', args.iban.toUpperCase()).get();

    if (where.empty) {
      return false;
    } else {
      return true;
    }
  }

  return bankAccount ? bankAccount.exists : false;
};