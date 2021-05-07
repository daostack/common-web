import { inputObjectType } from 'nexus';

export const CommonWhereUniqueInput = inputObjectType({
  name: 'CommonWhereUniqueInput',
  definition(t) {
    t.nonNull.id('id');
  }
})