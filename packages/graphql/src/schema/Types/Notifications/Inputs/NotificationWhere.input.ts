import { inputObjectType } from 'nexus';

export const NotificationWhereInput = inputObjectType({
  name: 'NotificationWhereInput',
  definition(t) {
    t.field('seenStatus', {
      type: 'NotificationSeenStatus'
    });

    t.field('type', {
      type: 'NotificationType'
    });

    t.id('userId');

    t.uuid('commonId');
    t.uuid('proposalId');
    t.uuid('discussionId');
  }
});