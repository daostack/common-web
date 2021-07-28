import { objectType } from 'nexus';

export const PayoutApproverType = objectType({
  name: 'PayoutApprover',
  definition(t) {
    t.implements('BaseEntity');

    t.nonNull.field('outcome', {
      type: 'PayoutApproverResponse'
    });

    t.nonNull.id('userId');
  }
});