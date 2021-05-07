import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const ProposalFundingExtension = extendType({
  type: 'Proposal',
  definition(t) {
    t.uuid('fundingId');

    t.field('funding', {
      type: 'FundingProposal',
      resolve: (root) => {
        if (!root.fundingId) {
          return null;
        }

        return prisma.fundingProposal
          .findUnique({
            where: {
              id: root.fundingId
            }
          });
      }
    });
  }
});