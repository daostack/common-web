import { ICommonEntity } from '../types';
import { CommonsCollection } from './index';
import { Nullable } from '../../util/types';
import { ArgumentError, NotFoundError } from '../../util/errors';
import admin from 'firebase-admin';
import Transaction = admin.firestore.Transaction;

/**
 * Gets common by id
 *
 * @param commonId - The ID of the common, that you want to find
 *
 * @throws { ArgumentError } - If the commonId param is with falsy value
 * @throws { NotFoundError } - If the common is not found
 *
 * @returns - The found common
 */
export const getCommon = async (commonId: string): Promise<ICommonEntity> => {
  if(!commonId) {
    throw new ArgumentError('commonId', commonId);
  }

  const common = (await CommonsCollection
    .doc(commonId)
    .get()).data() as Nullable<ICommonEntity>;

  if (!common) {
    throw new NotFoundError(commonId, 'common');
  }

  return common;
}

/**
 * Get common by it's ID with up to date transactional
 * data guarantee
 *
 * @param transaction - The currently running transaction
 * @param commonId - The ID of the common that we want to retrieve
 *
 * @throws { ArgumentError } - If the commonId param is with falsy value
 * @throws { NotFoundError } - If the common is not found
 *
 * @returns - The found common
 */
export const getCommonTransactional = async (transaction: Transaction, commonId: string): Promise<ICommonEntity> => {
  if (!commonId) {
    throw new ArgumentError('commonId', commonId);
  }

  const common = (await transaction.get(
    CommonsCollection.doc(commonId)
  )).data();

  if (!common) {
    throw new NotFoundError(commonId, 'common');
  }

  return common;
};