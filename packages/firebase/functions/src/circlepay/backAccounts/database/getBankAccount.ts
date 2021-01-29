import { ArgumentError, NotFoundError } from '../../../util/errors';

import { BankAccountCollection } from './index';
import { IBankAccountEntity } from '../types';

/**
 * Gets bankAccount by id
 *
 * @param bankAccountId - The ID of the bankAccount, that you want to find
 * @param throwErr - Whether an error will be thrown if the bank account is not found
 *
 * @throws { ArgumentError } - If the bankAccountId param is with falsy value
 * @throws { NotFoundError } - If the bankAccount is not found
 *
 * @returns - The found bankAccount
 */
export const getBankAccount = async (bankAccountId: string, throwErr = true): Promise<IBankAccountEntity> => {
  if(!bankAccountId) {
    throw new ArgumentError('bankAccountId', bankAccountId);
  }

  const bankAccount = (await BankAccountCollection
    .doc(bankAccountId)
    .get()).data();

  if(!bankAccount && throwErr) {
    throw new NotFoundError(bankAccountId, 'bankAccount');
  }
  return bankAccount;
}