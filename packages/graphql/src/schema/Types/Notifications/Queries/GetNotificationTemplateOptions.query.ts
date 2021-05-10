import { queryField } from 'nexus';

export const GetNotificationTemplateOptionsQuery = queryField('notificationTemplateOptions', {
  type: 'NotificationTemplateOptions',
  resolve: () => ({})
});