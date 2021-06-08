import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const ReportReportedProposalExtension = extendType({
  type: 'Report',
  definition(t) {
    t.uuid('proposalId');

    t.field('proposal', {
      type: 'Proposal',
      resolve: async (root) => {
        return (await prisma.report
          .findUnique({
            where: {
              id: root.id
            }
          })
          .proposal())!;
      }
    });
  }
});