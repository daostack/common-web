import { arg, extendType, nonNull } from 'nexus';
import { PayoutType } from '../types/Payout.type';
import { ExecutePayoutsInput } from '../inputs/ExecutePayouts.input';
import { createBatchPayout } from '../../../../../circlepay/payouts/business/createBatchPayout';

export const ExecutePayoutsMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('executePayouts', {
      type: PayoutType,
      args: {
        input: nonNull(
          arg({
            type: ExecutePayoutsInput
          })
        )
      },
      resolve: async (root, args) => {
        return await createBatchPayout(args.input);
      }
    });
  }
});