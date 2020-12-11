import { IBankAccountEntity } from '../types';
import { BankAccountCollection } from './index';

interface IGetBankAccountOptions {
  /**
   * This will return only one (or 0) bank accounts
   * where the unique fingerprint is matching
   */
  fingerprint?: string;
}

/**
 * Returns all bankAccounts matching the chosen options
 *
 * @param options - The options for filtering the bankAccounts
 */
export const getBankAccounts = async (options: IGetBankAccountOptions): Promise<IBankAccountEntity[]> => {
  let bankAccountsQuery: any = BankAccountCollection;

  if (options.fingerprint) {
    bankAccountsQuery = bankAccountsQuery.where('circleFingerprint', '==', options.fingerprint);
  }

  return (await bankAccountsQuery.get()).docs
    .map(bankAccount => bankAccount.data());
};