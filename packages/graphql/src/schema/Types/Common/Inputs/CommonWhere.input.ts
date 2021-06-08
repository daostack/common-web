import { inputObjectType } from 'nexus';

export const CommonWhereInput = inputObjectType({
  name: 'CommonWhereInput',
  definition(t) {
    t.field('name', {
      type: 'StringFilter'
    });

    t.field('id', {
      type: 'StringFilter'
    });
  }
});