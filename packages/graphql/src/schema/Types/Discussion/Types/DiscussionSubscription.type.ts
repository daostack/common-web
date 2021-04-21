import { objectType } from 'nexus';

export const DiscussionSubscriptionType = objectType({
  name: 'DiscussionSubscription',
  definition(t) {
    t.implements('BaseEntity');

    t.nonNull.field('type', {
      type: 'DiscussionSubscriptionType'
    });

    t.nonNull.string('userId');
    t.nonNull.uuid('discussionId');
  }
});