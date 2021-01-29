import { ArgumentError, NotFoundError } from '../../../util/errors';

import { IPayoutEntity } from '../types';
import { PayoutsCollection } from './index';

/**
 * Gets payout by id
 *
 * @param payoutId - The ID of the payout, that you want to find. Please note
 *                that this is the local ID of the payout and not the one,
 *                provided by Circle
 *
 * @throws { ArgumentError } - If the payoutId param is with falsy value
 * @throws { NotFoundError } - If the payout is not found
 *
 * @returns - The found payout
 */
export const getPayout = async (payoutId: string): Promise<IPayoutEntity> => {
  if (!payoutId) {
    throw new ArgumentError('payoutId', payoutId);
  }

  const payout = (await PayoutsCollection
    .doc(payoutId)
    .get()).data();

  if (!payout) {
    throw new NotFoundError(payoutId, 'payout');
  }

  return payout;
};