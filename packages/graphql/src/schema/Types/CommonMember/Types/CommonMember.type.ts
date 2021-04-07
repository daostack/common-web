import { objectType } from 'nexus';

export const CommonMemberType = objectType({
  name: 'CommonMember',
  definition(t) {
    t.nonNull.id('id');

    t.nonNull.id('userId');
    t.nonNull.id('commonId');

    t.nonNull.field('user', {
      type: 'User',
      // complexity: 10,

    })
  }
});