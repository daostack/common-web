import { inputObjectType } from 'nexus';

export const EventOrderByInput = inputObjectType({
  name: 'EventOrderByInput',
  definition(t) {
    t.field('createdAt', {
      type: 'SortOrder'
    });

    t.field('updatedAt', {
      type: 'SortOrder'
    });

    t.field('type', {
      type: 'SortOrder'
    });
  }
});