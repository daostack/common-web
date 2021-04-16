import { subscriptionField } from 'nexus';
import { Notification } from '@prisma/client';

import { pubSub } from '@common/core';

export const NotificationCreatedSubscription = subscriptionField('notificationCreated', {
  type: 'Notification',
  subscribe: async (root, args, ctx) => {
    const userId = await ctx.getUserId();

    return pubSub.asyncIterator<Notification>(`Notifications.${userId}.Created`);
  },
  resolve: (root: Notification) => {
    return root;
  }
});