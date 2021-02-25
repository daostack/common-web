import { extendType, idArg, nonNull } from 'nexus';
import { PaymentType } from '../types/Payment.type';
import { paymentDb } from '../../../../../circlepay/payments/database';

export const GetPaymentQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('payment', {
      type: PaymentType,
      args: {
        id: nonNull(idArg())
      },
      resolve: (root, args) => {
        // @todo !important Do some kind of permission check !!!!!!!!!

        return paymentDb.get(args.id);
      }
    });
  }
});