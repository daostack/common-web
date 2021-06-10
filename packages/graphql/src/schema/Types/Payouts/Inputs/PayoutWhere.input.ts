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

    t.boolean('isPendingApprover', {
      description: 'Find all pending payouts where the currently sign in user has to give approval'
    });
  }
});