import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const ProposalReportExtension = extendType({
  type: 'Proposal',
  definition(t) {
    t.nonNull.list.field('reports', {
      type: 'Report',
      resolve: (root) => {
        return prisma.report
          .findMany({
            where: {
              proposalId: root.id
            }
          });
      }
    });
  }
});