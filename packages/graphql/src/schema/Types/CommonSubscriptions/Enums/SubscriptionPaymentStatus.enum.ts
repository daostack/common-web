import { SubscriptionPaymentStatus } from '@prisma/client';
import { enumType } from 'nexus';

export const SubscriptionPaymentStatusEnum = enumType({
  name: 'SubscriptionPaymentStatus',
  members: SubscriptionPaymentStatus
});