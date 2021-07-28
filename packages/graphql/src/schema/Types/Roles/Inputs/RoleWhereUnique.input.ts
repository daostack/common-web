import { inputObjectType } from 'nexus';

export const RoleWhereUniqueInput = inputObjectType({
  name: 'RoleWhereUniqueInput',
  definition(t) {
    t.id('id');
    t.string('name');
  }
});