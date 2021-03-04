import * as functions from 'firebase-functions';
import { chargeSubscriptions, revokeMemberships } from '../business';

/**
 * Runs the daily crons job, responsible for charging the subscriptions
 * due and revoking memberships for canceled subscription
 */
export const dailySubscriptionCron = functions.pubsub
  .schedule('17 5 * * *') // => every day at 05:17 AM
  .onRun(async () => {
    // Execute the subscription charging and revoking asynchronously
    await Promise.all([
      chargeSubscriptions(),
      revokeMemberships()
    ]);
  });