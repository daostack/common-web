import { queryField, list, arg } from 'nexus';
import { ReportFlag } from '@prisma/client';

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
          flag: {
            notIn: [
              ReportFlag.Hidden
            ]
          },

          ...args.where,

          ...(args.fundingWhere && ({
            funding: args.fundingWhere
          })),


        },
        ...args.paginate as any
      });
  }
});