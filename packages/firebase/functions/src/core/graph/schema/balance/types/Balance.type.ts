import { objectType } from 'nexus';
import { AmountType } from './Amount.type';

export const BalanceType = objectType({
  name: 'Balance',
  definition(t) {
    t.field('available', {
      type: AmountType
    });

    t.field('unsettled', {
      type: AmountType
    });
  }
});