import { inputObjectType } from 'nexus';

export const DiscussionMessagesOrderByInput = inputObjectType({
  name: 'DiscussionMessagesOrderByInput',
  definition(t) {
    t.field('createdAt', {
      type: 'SortOrder'
    });

    t.field('updatedAt', {
      type: 'SortOrder'
    });
  }
});