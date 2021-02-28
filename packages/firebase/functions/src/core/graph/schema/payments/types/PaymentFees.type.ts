import { objectType } from 'nexus';
import { PaymentCurrencyEnum } from '../enums/PaymentCurrency.enum';

export const PaymentFeesType = objectType({
  name: 'PaymentFees',
  definition(t) {
    t.int('amount');

    t.field('currency', {
      type: PaymentCurrencyEnum
    });
  }
});