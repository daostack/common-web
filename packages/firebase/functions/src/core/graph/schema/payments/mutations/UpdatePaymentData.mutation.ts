import { extendType, idArg, nonNull } from 'nexus';
import { v4 } from 'uuid';

import { updatePaymentFromCircle } from '../../../../../circlepay/payments/business/updatePaymentFromCircle';

export const UpdatePaymentDataMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.boolean('updatePaymentData', {
      args: {
        id: nonNull(idArg()),
        trackId: idArg({
          default: v4()
        })
      },
      resolve: async (root, args) => {
        try {
          await updatePaymentFromCircle(args.id, args.trackId);

          return true;
        } catch (e) {
          logger.error(`An error occurred while updating the payment: ${ e.message }`, {
            error: e
          });

          return false;
        }
      }
    });
  }
});