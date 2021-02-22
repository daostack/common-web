import { objectType } from 'nexus';

import { PaymentSourceType } from './PaymentSoure.type';
import { PaymentFeesType } from './PaymentFees.type';

import { PaymentTypeEnum } from '../enums/PaymentType.enum';
import { PaymentStatusEnum } from '../enums/PaymentStatus.enum';
import { PaymentAmountType } from './PaymentAmount.type';

export const PaymentType = objectType({
  name: 'Payment',
  definition(t) {
    t.nonNull.id('id', {
      description: 'The ID of the payment'
    });

    t.nonNull.date('createdAt', {
      description: 'The date at witch the payment was created'
    });

    t.nonNull.date('updatedAt', {
      description: 'The date at witch the payment was last updated'
    });

    t.nonNull.field('type', {
      type: PaymentTypeEnum
    });

    t.nonNull.field('status', {
      type: PaymentStatusEnum
    })

    t.nonNull.field('source', {
      type: PaymentSourceType,
      description: 'The source from witch the payment was funded'
    });

    t.nonNull.field('amount', {
      type: PaymentAmountType
    });

    t.field('fees', {
      type: PaymentFeesType,
      description: 'The fees on the payment'
    })

    t.nonNull.id('circlePaymentId');
    t.nonNull.id('proposalId');
    t.nonNull.id('userId');
    t.id('subscriptionId');
  }
});