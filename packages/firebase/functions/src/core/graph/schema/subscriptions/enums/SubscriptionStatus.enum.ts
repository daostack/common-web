import { enumType } from 'nexus';

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