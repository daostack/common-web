import { inputObjectType } from 'nexus';

export const PayoutApproverFilterInput = inputObjectType({
  name: 'PayoutApproverFilter',
  definition(t) {
    t.field('some', {
      type: 'PayoutApproversWhereInput'
    });

    t.field('every', {
      type: 'PayoutApproversWhereInput'
    });

    t.field('none', {
      type: 'PayoutApproversWhereInput'
    });
  }
});