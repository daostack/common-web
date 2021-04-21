import { enumType } from 'nexus';
import { NotificationType } from '@prisma/client';

export const NotificationTypeEnum = enumType({
  name: 'NotificationType',
  members: NotificationType
});