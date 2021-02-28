import { extendType } from 'nexus';

import { SubscriptionType } from '../../subscriptions/types/Subscription.types';

import { subscriptionDb } from '../../../../../subscriptions/database';

export const PaymentSubscriptionExtension = extendType({
  type: 'Payment',
  definition(t) {
    t.field('subscription', {
      type: SubscriptionType,
      resolve: (root) => {
        return subscriptionDb.get(root.subscriptionId);
      }
    });
  }
});