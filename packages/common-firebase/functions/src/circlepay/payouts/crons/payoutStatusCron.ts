import * as functions from 'firebase-functions';
import { payoutDb } from '../database';
import { updatePayoutStatus } from '../business/updatePayoutStatus';

// Update the payout statuses every 12 hours
export const payoutStatusCron = functions.pubsub
  .schedule('0 */12 * * *')
  .onRun(async () => {
    const pendingPayouts = await payoutDb.getMany({
      status: 'pending'
    });

    if(pendingPayouts && pendingPayouts.length) {
      const promiseArr: Promise<void>[] = [];

      pendingPayouts.forEach(payout => {
        promiseArr.push((async () => {
          logger.info(`Updating the status of payout ${payout.id}`);

          await updatePayoutStatus(payout);
        })())
      })
    }
  });
