import * as functions from 'firebase-functions';

// Create the daily statistic everyday at 00:00
export const createDailyStatistic = functions.pubsub
  .schedule('0 0 */1 * *')
  .onRun(async () => {
    const timestamp = (new Date().setUTCHours(0, 0, 0, 0));
  });
