import { objectType } from 'nexus';

export const CommonMemberType = objectType({
  name: 'CommonMember',
  definition(t) {
    t.nonNull.id('id');

    t.nonNull.id('userId');
    t.nonNull.id('commonId');

    t.nonNull.list.nonNull.field('roles', {
      complexity: 0,
      type: 'CommonMemberRole'
    });
  }
});