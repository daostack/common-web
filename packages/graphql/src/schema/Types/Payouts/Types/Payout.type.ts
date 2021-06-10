import { objectType } from 'nexus';

export const PayoutType = objectType({
  name: 'Payout',
  definition(t) {
    t.implements('BaseEntity');

    t.nonNull.field('status', {
      type: 'PayoutStatus'
    });

    t.nonNull.int('amount');
    t.nonNull.string('description');
  }
});