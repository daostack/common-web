import { inputObjectType } from 'nexus';

export const ProposalWhereInput = inputObjectType({
  name: 'ProposalWhereInput',
  definition(t) {
    t.field('id', {
      type: 'StringFilter'
    });

    t.field('type', {
      type: 'ProposalType'
    });

    t.field('state', {
      type: 'ProposalState'
    });

    t.uuid('commonId');
    t.uuid('commonMemberId');
    t.id('userId');

    t.field('title', {
      type: 'StringFilter'
    });

    t.field('description', {
      type: 'StringFilter'
    });

    t.list.nonNull.field('AND', {
      type: 'ProposalWhereInput'
    });

    t.list.nonNull.field('OR', {
      type: 'ProposalWhereInput'
    });
  }
});