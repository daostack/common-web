import { objectType } from 'nexus';

export const JoinProposalType = objectType({
  name: 'JoinProposal',
  definition(t) {
    t.implements('BaseEntity');

    t.nonNull.int('funding', {
      description: 'The amount that this join proposal will contribute to the common. In cents'
    });

    t.nonNull.field('fundingType', {
      type: 'FundingType'
    });

    t.nonNull.field('paymentState', {
      type: 'PaymentState'
    });
  }
});