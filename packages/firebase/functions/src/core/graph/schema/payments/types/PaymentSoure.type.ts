import { objectType } from 'nexus';
import { PaymentSourceEnum } from '../enums/PaymentSource.enum';

export const PaymentSourceType = objectType({
  name: 'PaymentSource',
  definition(t) {
    t.nonNull.field('type', {
      type: PaymentSourceEnum
    });

    t.id('id')
  }
});