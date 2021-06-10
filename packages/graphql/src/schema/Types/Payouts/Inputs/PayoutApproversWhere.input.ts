import { inputObjectType } from 'nexus';

export const PayoutApproversWhereInput = inputObjectType({
  name: 'PayoutApproversWhereInput',
  definition(t) {
    t.field('id', {
      type: 'StringFilter'
    });

    t.field('userId', {
      type: 'StringFilter'
    });

    t.field('outcome', {
      type: 'PayoutApproverResponse'
    });
  }
});