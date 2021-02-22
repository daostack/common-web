import { booleanArg, extendType, intArg } from 'nexus';
import { PaymentType } from '../types/Payment.type';
import { paymentDb } from '../../../../../circlepay/payments/database';

export const GetPaymentsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('payments', {
      type: PaymentType,
      args: {
        page: intArg({
          default: 1
        }),

        hanging: booleanArg()
      },
      resolve: (root, args) => {
        // @todo !important Authorization!

        return paymentDb.getMany(args.hanging ? {
            status: 'pending',
            olderThan: new Date((new Date().getTime()) - 60 * 60 * 1000)
          } : {
            first: 10,
            after: (args.page - 1) * 10
          }
        );
      }
    });
  }
});