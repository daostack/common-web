import { extendType } from 'nexus';
import { ProposalType } from '@prisma/client';

import { prisma } from '@common/core';

export const CommonActiveProposalsExtension = extendType({
  type: 'Common',
  definition(t) {
    t.nonNull.int('activeProposals', {
      resolve: (root) => {
        return prisma.proposal
          .count({
            where: {
              commonId: root.id
            }
          });
      }
    });

    t.nonNull.int('activeFundingProposals', {
      resolve: (root) => {
        return prisma.proposal
          .count({
            where: {
              commonId: root.id,
              type: ProposalType.FundingRequest
            }
          });
      }
    });

    t.nonNull.int('activeJoinProposals', {
      resolve: (root) => {
        return prisma.proposal
          .count({
            where: {
              commonId: root.id,
              type: ProposalType.JoinRequest
            }
          });
      }
    });
  }
});