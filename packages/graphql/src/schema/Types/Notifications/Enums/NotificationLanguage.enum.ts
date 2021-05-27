import { enumType } from 'nexus';
import { NotificationLanguage } from '@prisma/client';

export const NotificationLanguageEnum = enumType({
  name: 'NotificationLanguage',
  members: NotificationLanguage
});