import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const PayoutProposalsExtension = extendType({
  type: 'Payout',
  definition(t) {
    t.nonNull.list.nonNull.field('proposals', {
      type: 'Proposal',
      resolve: async (root) => {
        const { proposals } = (await prisma.payout
          .findUnique({
            where: {
              id: root.id
            },
            select: {
              proposals: true
            }
          }) || { proposals: [] });

        return proposals as any;
      }
    });
  }
});