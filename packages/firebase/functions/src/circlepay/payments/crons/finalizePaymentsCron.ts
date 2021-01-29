import * as functions from 'firebase-functions';
import * as uuid from 'uuid';

import { updatePaymentsFromCircle } from '../business/updatePaymentsFromCircle';

export const finalizePaymentCron = functions.pubsub
  .schedule('0 */12 * * *')
  .onRun(async () => {
    const trackId = uuid.v4();

    logger.info('Pending payments data update cronjob started', {
      trackId
    });

    await updatePaymentsFromCircle(trackId);

    logger.info('✨ Pending payments data update cronjob finished successfully', {
      trackId
    });
  });
