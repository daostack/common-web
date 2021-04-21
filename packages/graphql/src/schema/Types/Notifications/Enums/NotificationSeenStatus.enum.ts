import { enumType } from 'nexus';
import { NotificationSeenStatus } from '@prisma/client';

export const NotificationSeenStatusEnum = enumType({
  name: 'NotificationSeenStatus',
  members: NotificationSeenStatus
});