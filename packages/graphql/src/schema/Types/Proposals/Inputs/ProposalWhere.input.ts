import { inputObjectType } from 'nexus';

export const ProposalWhereInput = inputObjectType({
  name: 'ProposalWhereInput',
  definition(t) {
    t.field('type', {
      type: 'ProposalType'
    });

    t.field('state', {
      type: 'ProposalState'
    });

    t.uuid('commonId');
    t.uuid('commonMemberId');
    t.id('userId');
  }
});