import { inputObjectType } from 'nexus';

export const CommonMemberOrderByInput = inputObjectType({
  name: 'CommonMemberOrderByInput',
  definition(t) {
    t.nonNull.field('createdAt', {
      type: 'SortOrder'
    });
  }
});