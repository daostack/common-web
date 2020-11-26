import * as functions from 'firebase-functions';

import { commonApp, commonRouter } from '../util';
import { responseExecutor } from '../util/responseExecutor';
import { runtimeOptions } from '../util/constants';
import { CommonError } from '../util/errors';
import { cancelSubscription } from './business';
import { CancellationReason } from './business/cancelSubscription';
import { subscriptionDb } from './database';

const router = commonRouter();

router.post('/cancel', async (req, res, next) => {
  await responseExecutor(async () => {
    const {subscriptionId} = req.query;

    if (!subscriptionId) {
      throw new CommonError('The subscription id is required, but not provided!');
    }

    const subscription = await subscriptionDb.get(subscriptionId as string);

    if (subscription.userId !== req.user.uid) {
      throw new CommonError(`
        Cannot cancel subscription that is not yours
      `);
    }

    await cancelSubscription(subscription, CancellationReason.CanceledByUser);
  }, {
    req,
    res,
    next,
    successMessage: `Subscription successfully canceled`
  });
});

export const subscriptionsApp = functions
  .runWith(runtimeOptions)
  .https.onRequest(commonApp(router));