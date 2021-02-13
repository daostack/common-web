import { enumType, objectType } from 'nexus';

export const SubscriptionStatusEnum = enumType({
  name: 'SubscriptionStatus',
  members: [
    'pending',
    'active',
    'canceledByUser',
    'canceledByPaymentFailure',
    'paymentFailed'
  ]
});

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

export const SubscriptionMetadataType = objectType({
  name: 'SubscriptionMetadata',
  definition(t) {
    t.field('common', {
      type: SubscriptionMetadataCommonType
    });
  }
});

export const SubscriptionMetadataCommonType = objectType({
  name: 'SubscriptionMetadataCommon',
  definition(t) {
    t.id('id');
    t.string('name');
  }
});