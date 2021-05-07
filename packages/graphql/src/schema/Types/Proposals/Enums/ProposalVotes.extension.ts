import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const ProposalVotesExtension = extendType({
  type: 'Proposal',
  definition(t) {
    t.nonNull.list.nonNull.field('votes', {
      type: 'Vote',
      resolve: (root) => {
        return prisma.proposal
          .findUnique({
            where: {
              id: root.id
            }
          })
          .votes();
      }
    });
  }
});