import { enumType } from 'nexus';
import { NotificationTemplateType } from '@prisma/client';

export const NotificationTemplateTypeEnum = enumType({
  name: 'NotificationTemplateType',
  members: NotificationTemplateType
});