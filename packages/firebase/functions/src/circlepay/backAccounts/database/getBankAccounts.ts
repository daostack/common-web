import { IBankAccountEntity } from '../types';
import { BankAccountCollection } from './index';
import { CommonError } from '../../../util/errors';

interface IGetBankAccountOptions {
  /**
   * This will return only one (or 0) bank accounts
   * where the unique fingerprint is matching
   */
  fingerprint?: string;

  /**
   * Get the last {number} of elements sorted
   * by createdAt date
   */
  last?: number;

  /**
   * Get the first {number} of elements sorted
   * by createdAt date
   */
  first?: number;

  /**
   * If sorting skip {number} elements
   */
  after?: number;
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

  // Sorting and paging
  if (options.first || options.last) {
    const { first, last, after } = options;

    if (first && last) {
      throw new CommonError('Only first or only last can be selected, not both!');
    }

    if (first) {
      bankAccountsQuery = bankAccountsQuery
        .orderBy('createdAt', 'asc')
        .limit(first);
    }

    if (last) {
      bankAccountsQuery = bankAccountsQuery
        .orderBy('createdAt', 'desc')
        .limit(last);
    }

    if (after && after > 0) {
      bankAccountsQuery = bankAccountsQuery
        .offset(after);
    }
  }


  return (await bankAccountsQuery.get()).docs
    .map(bankAccount => bankAccount.data());
};