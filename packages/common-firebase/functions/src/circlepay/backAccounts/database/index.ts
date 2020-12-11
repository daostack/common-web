import { db } from '../../../util';
import { Collections } from '../../../constants';
import { IBankAccountEntity } from '../types';
import { addBankAccount } from './addBankAccount';
import { getBankAccounts } from './getBankAccounts';
import { bankAccountExists } from './bankAccountExists';
import { getBankAccount } from './getBankAccount';


export const BankAccountCollection = db.collection(Collections.BankAccounts)
  .withConverter<IBankAccountEntity>({
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): IBankAccountEntity {
      return snapshot.data() as IBankAccountEntity;
    },

    toFirestore(object: IBankAccountEntity | Partial<IBankAccountEntity>): FirebaseFirestore.DocumentData {
      return object;
    }
  });

export const bankAccountDb = {
  add: addBankAccount,
  get: getBankAccount,
  getMany: getBankAccounts,
  exists: bankAccountExists
};