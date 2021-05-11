import { queryField } from 'nexus';

export const GetNotificationEventOptionsQuery = queryField('notificationEventOptions', {
  type: 'NotificationEventOptions',
  resolve: () => ({})
});