import { inputObjectType } from 'nexus';

export const UserWhereUniqueInput = inputObjectType({
  name: 'UserWhereUniqueInput',
  definition(t) {
    t.nonNull.id('userId');
  }
});