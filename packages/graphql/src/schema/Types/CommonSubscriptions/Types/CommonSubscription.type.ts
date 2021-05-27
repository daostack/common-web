import { objectType } from 'nexus';

export const CommonSubscriptionType = objectType({
  name: 'CommonSubscription',
  definition(t) {
    t.implements('BaseEntity');

    t.nonNull.field('paymentStatus', {
      type: 'SubscriptionPaymentStatus'
    });

    t.nonNull.field('status', {
      type: 'SubscriptionStatus'
    });

    t.nonNull.date('dueDate');
    t.nonNull.date('chargedAt');

    t.nonNull.boolean('voided');

    t.nonNull.int('amount');
  }
});