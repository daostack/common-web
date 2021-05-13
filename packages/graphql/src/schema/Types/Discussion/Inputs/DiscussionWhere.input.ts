import { inputObjectType } from 'nexus';

export const DiscussionWhereInput = inputObjectType({
  name: 'DiscussionWhereInput',
  definition(t) {
    t.uuid('commonId');
    t.uuid('commonMemberId');
    t.id('userId');
  }
});