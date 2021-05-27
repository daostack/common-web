import { queryField, list, arg } from 'nexus';
import { prisma } from '@common/core';

export const GetProposalsQuery = queryField('proposals', {
  type: list('Proposal'),
  args: {
    where: arg({
      type: 'ProposalWhereInput'
    }),
    paginate: arg({
      type: 'PaginateInput'
    })
  },
  resolve: (root, args) => {
    return prisma.proposal
      .findMany({
        where: args.where as any,
        ...args.paginate
      });
  }
});