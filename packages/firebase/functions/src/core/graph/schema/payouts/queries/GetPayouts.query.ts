import { extendType, intArg } from "nexus";
import { PayoutType } from '../types/Payout.type';
import { payoutDb } from '../../../../../circlepay/payouts/database';

export const GetPayoutsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('payouts', {
      type: PayoutType,
      args: {
        page: intArg({
          default: 1
        })
      },
      resolve: async () => {
        return (await payoutDb.getMany({})).filter(x => Boolean((x as any).proposalIds));
      }
    })
  }
})