import { extendType, intArg, arg } from 'nexus';

import { subscriptionDb } from '../../../../../subscriptions/database';

import { SubscriptionType } from '../../subscriptions/types/Subscription.types';
import { SubscriptionStatusEnum } from '../../subscriptions/enums/SubscriptionStatus.enum';

export const UserSubscriptionsExtensions = extendType({
  type: 'User',
  definition(t) {
    t.list.field('subscriptions', {
      type: SubscriptionType,
      args: {
        page: intArg({
          default: 1
        }),

        status: arg({
          type: SubscriptionStatusEnum
        })
      },
      resolve: async (root: any, args) => {
        return subscriptionDb.getMany({
          userId: root.id || root.uid
        });
      }
    });
  }
})