import { extendType, nonNull, arg } from 'nexus';
import { prisma } from '@common/core';

export const GetProposalQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('proposal', {
      type: 'Proposal',
      args: {
        where: nonNull(
          arg({
            type: 'ProposalWhereUniqueInput'
          })
        )
      },
      resolve: (root, args) => {
        return prisma.proposal
          .findUnique({
            where: args.where
          });
      }
    });
  }
});