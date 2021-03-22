import * as functions from 'firebase-functions';

import { commonApp, commonRouter } from '../util';
import { runtimeOptions } from '../util/constants';
import { CommonError } from '../util/errors';
import { responseExecutor } from '../util/responseExecutor';
import { cancelSubscription, chargeSubscriptions, revokeMemberships } from './business';
import { CancellationReason } from './business/cancelSubscription';
import { subscriptionDb } from './database';
import { env } from '../constants';


const router = commonRouter();

router.post('/cancel', async (req, res, next) => {
  await responseExecutor(async () => {
    const { subscriptionId } = req.query;

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

// if (env.environment !== 'production') {
  router.get('/subscription/revoke', async (req, res) => {
    await revokeMemberships();

    res.send('Done!');
  });

  router.get('/subscription/charge', async (req, res) => {
    await chargeSubscriptions();

    res.send('Done!');
  });
// }


export const subscriptionsApp = functions
  .runWith(runtimeOptions)
  .https.onRequest(commonApp(router, {
    unauthenticatedRoutes: [
      '/subscription/revoke',
      '/subscription/charge'
    ]
  }));