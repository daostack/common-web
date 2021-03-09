import * as functions from 'firebase-functions';
import { updatePayoutsStatus } from '../business/updatePayoutsStatus';

// Update the payout statuses every 12 hours
export const payoutStatusCron = functions.pubsub
  .schedule('0 */12 * * *')
  .onRun(async () => {
    await updatePayoutsStatus();
  });
