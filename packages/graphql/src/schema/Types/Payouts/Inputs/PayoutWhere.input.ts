import { inputObjectType } from 'nexus';

export const PayoutWhereInput = inputObjectType({
  name: 'PayoutWhereInput',
  definition(t) {
    t.field('status', {
      type: 'PayoutStatusFilter'
    });

    t.field('approvers', {
      type: 'PayoutApproverFilter'
    });
  }
});