import { extendType, idArg, nonNull } from 'nexus';
import { updatePayoutStatus } from '../../../../../circlepay/payouts/business/updatePayoutStatus';
import { payoutDb } from '../../../../../circlepay/payouts/database';

export const UpdatePayoutStatusMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.boolean('updatePayoutStatus', {
      args: {
        payoutId: nonNull(idArg())
      },
      resolve: async (root, { payoutId }) => {
        await updatePayoutStatus(
          await payoutDb.get(payoutId)
        );

        return true;
      }
    });
  }
});