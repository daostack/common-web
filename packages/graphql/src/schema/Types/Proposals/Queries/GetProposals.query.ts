import { queryField, list, arg } from 'nexus';
import { prisma } from '@common/core';

export const GetProposalsQuery = queryField('proposals', {
  type: list('Proposal'),
  args: {
    where: arg({
      type: 'ProposalWhereInput'
    }),
    fundingWhere: arg({
      type: 'FundingProposalWhereInput'
    }),
    paginate: arg({
      type: 'PaginateInput'
    })
  },
  resolve: (root, args) => {
    return prisma.proposal
      .findMany({
        where: {
          ...args.where,

          ...(args.fundingWhere && ({
            funding: args.fundingWhere
          }))
        },
        ...args.paginate as any
      });
  }
});