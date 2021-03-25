import { payoutDb } from '../database';
import { updatePayoutStatus } from './updatePayoutStatus';

/**
 * Updates the status of all pending payouts from circle
 */
export const updatePayoutsStatus = async (): Promise<void> => {
  const pendingPayouts = await payoutDb.getMany({
    status: 'pending'
  });

  if (pendingPayouts && pendingPayouts.length) {
    for (const payout of pendingPayouts) {
      logger.info(`Updating the status of payout ${ payout.id }`);

      try {
        // eslint-disable-next-line no-await-in-loop
        await updatePayoutStatus(payout);
      } catch (e) {
        logger.error('Unable to update the status of payout', {
          payout
        });
      }
    }
  }
};