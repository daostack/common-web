import { enumType } from 'nexus';
import { DiscussionSubscriptionType } from '@prisma/client';

export const DiscussionSubscriptionTypeEnum = enumType({
  name: 'DiscussionSubscriptionType',
  members: DiscussionSubscriptionType
});