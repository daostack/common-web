import { extendType, idArg, nonNull } from 'nexus';
import { PayoutType } from '../types/Payout.type';
import { payoutDb } from '../../../../../circlepay/payouts/database';

export const GetPayoutQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('payout', {
      type: PayoutType,
      args: {
        id: nonNull(
          idArg()
        )
      },
      resolve: (root, args) => {
        return payoutDb.get(args.id);
      }
    });
  }
});