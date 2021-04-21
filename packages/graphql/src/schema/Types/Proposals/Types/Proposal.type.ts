import { objectType } from 'nexus';

export const ProposalType = objectType({
  name: 'Proposal',
  definition(t) {
    t.nonNull.id('id', {
      description: 'The main identifier of the item'
    });

    t.nonNull.date('createdAt', {
      description: 'The date, at which the item was created'
    });

    t.nonNull.date('updatedAt', {
      description: 'The date, at which the item was last modified'
    });

    t.nonNull.field('type', {
      type: 'ProposalType'
    });

    t.nonNull.field('state', {
      type: 'ProposalState'
    });

    // @join
    // @funding
  }
});