import { inputObjectType } from 'nexus';

export const WireWhereInput = inputObjectType({
  name: 'WireWhereInput',
  definition(t) {
    t.field('userId', {
      type: 'StringFilter'
    });
  }
});