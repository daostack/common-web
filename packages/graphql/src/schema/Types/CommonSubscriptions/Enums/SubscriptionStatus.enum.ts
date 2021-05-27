import { SubscriptionStatus } from '@prisma/client';
import { enumType } from 'nexus';

export const SubscriptionStatusEnum = enumType({
  name: 'SubscriptionStatus',
  members: SubscriptionStatus
});