import { inputObjectType } from 'nexus';

export const DiscussionSubscriptionOrderByInput = inputObjectType({
  name: 'DiscussionSubscriptionOrderByInput',
  definition(t) {
    t.field('createdAt', {
      type: 'SortOrder'
    });

    t.field('updatedAt', {
      type: 'SortOrder'
    });
  }
});