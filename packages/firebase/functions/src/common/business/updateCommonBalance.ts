import admin from 'firebase-admin';

import { commonDb } from '../database';
import { IUpdatableCommonEntity } from '../database/updateCommon';
import { ArgumentError } from '../../util/errors';
import FieldValue = admin.firestore.FieldValue;

/**
 * Update the common balance and total raised value
 *
 * @param commonId - The ID of the common that we want to change the value for
 * @param amount - The amount in cents that we want to modify with. Can be positive or negative, but not 0. If the
 *    value is positive integer both the raised and balance amount will be updated. If it is negative only
 *    the balance will be updated
 *
 * @throws { ArgumentError } - If the amount is 0
 *
 * @returns Promise
 */
export const updateCommonBalance = async (commonId: string, amount: number): Promise<void> => {
  if (!amount) {
    throw new ArgumentError('amount', amount);
  }

  // Create the update payload
  const updatePayload: IUpdatableCommonEntity = {
    id: commonId,

    balance: FieldValue.increment(amount) as any
  };

  // Modify the total raised value only if the amount
  // is positive.
  if (amount > 0) {
    updatePayload.raised = FieldValue.increment(amount) as any;
  }

  // Save the changes
  await commonDb.update(updatePayload);
};