import { objectType } from "nexus";
import { PaymentCurrencyEnum } from '../enums/PaymentCurrency.enum';

export const PaymentAmountType = objectType({
  name: 'PaymentAmount',
  definition(t) {
    t.field('currency', {
      type: PaymentCurrencyEnum
    });

    t.int('amount', {
      resolve: (root) => Math.round((root as any).amount)
    });
  }
})