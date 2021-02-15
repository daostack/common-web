import { objectType } from 'nexus';

export const PayoutType = objectType({
  name: 'Payout',
  definition(t) {
    t.nonNull.id('id');
  }
});