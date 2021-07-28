import { inputObjectType } from 'nexus';

export const UserWhereInput = inputObjectType({
  name: 'UserWhereInput',
  definition(t) {
    t.field('firstName', {
      type: 'StringFilter'
    });

    t.field('lastName', {
      type: 'StringFilter'
    });

    t.field('email', {
      type: 'StringFilter'
    });

    t.list.nonNull.field('OR', {
      type: 'UserWhereInput'
    });

    t.list.nonNull.field('AND', {
      type: 'UserWhereInput'
    });
  }
});