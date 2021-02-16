import { objectType } from 'nexus';
import { WireBillingDetailsType } from './WireBillingDetails';
import { WireBankType } from './WireBank.type';

export const WireType = objectType({
  name: 'Wire',
  definition(t) {
    t.nonNull.id('id', {
      description: 'The local ID of the payout'
    });

    t.date('createdAt');
    t.date('updatedAt');

    t.string('description');

    t.field('bank', {
      type: WireBankType
    });

    t.field('billingDetails', {
      type: WireBillingDetailsType
    });
  }
});