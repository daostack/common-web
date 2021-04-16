import { inputObjectType } from 'nexus';

export const NotificationOrderByInput = inputObjectType({
  name: 'NotificationOrderByInput',
  definition(t) {
    t.field('createdAt', {
      type: 'SortOrder'
    });

    t.field('updatedAt', {
      type: 'SortOrder'
    });

    t.field('status', {
      type: 'SortOrder'
    });
  }
});