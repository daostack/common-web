import { objectType } from 'nexus';

import { SubscriptionMetadataType } from './SubscriptionMetadata.type';

import { SubscriptionStatusEnum } from '../enums/SubscriptionStatus.enum';

export const SubscriptionType = objectType({
  name: 'Subscription',
  definition(t) {
    t.nonNull.id('id');

    t.nonNull.id('cardId');
    t.nonNull.id('userId');
    t.nonNull.id('proposalId');

    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');

    t.nonNull.int('charges');
    t.nonNull.int('amount');

    t.date('lastChargedAt');
    t.date('dueDate');

    t.nonNull.boolean('revoked');

    t.nonNull.field('status', {
      type: SubscriptionStatusEnum,
      resolve: (root) => {
        const { status } = root as any;

        return status.charAt(0).toLowerCase() + status.slice(1);
      }
    });

    t.nonNull.field('metadata', {
      type: SubscriptionMetadataType
    });
  }
});

