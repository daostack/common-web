import { objectType } from 'nexus';
import { PayoutStatusEnum } from '../enums/PayoutStatus.enum';
import { PayoutSecurityType } from './PayoutSecurity.type';

export const PayoutType = objectType({
  name: 'Payout',
  definition(t) {
    t.nonNull.id('id');

    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');

    t.string('circlePayoutId');

    t.nonNull.int('amount');

    t.boolean('executed');
    t.boolean('voided');

    t.field('status', {
      type: PayoutStatusEnum
    });

    t.list.field('security', {
      type: PayoutSecurityType
    });

    t.list.string('proposalIds');
  }
});