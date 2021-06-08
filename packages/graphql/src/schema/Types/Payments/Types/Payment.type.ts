import { objectType } from 'nexus';

export const PaymentType = objectType({
  name: 'Payment',
  definition(t) {
    t.implements('BaseEntity');

    t.nonNull.boolean('processed');
    t.nonNull.boolean('processedError');

    t.nonNull.field('type', {
      type: 'PaymentType'
    });

    t.nonNull.field('status', {
      type: 'PaymentStatus'
    });

    t.field('circlePaymentStatus', {
      type: 'PaymentCircleStatus'
    });

    t.string('circlePaymentId');

    t.int('amount', {
      description: 'The amount of the payment in US dollar cents'
    });

    t.int('fees', {
      description: 'The payment fees in US dollar cents'
    });
  }
});