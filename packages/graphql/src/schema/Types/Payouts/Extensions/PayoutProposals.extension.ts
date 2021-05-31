import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const PayoutProposalsExtension = extendType({
  type: 'Payout',
  definition(t) {
    t.nonNull.list.nonNull.field('proposals', {
      type: 'Proposal',
      resolve: async (root) => {
        return (await prisma.payout
          .findUnique({
            where: {
              id: root.id
            }
          })
          .proposals({
            select: {
              proposal: true
            }
          })).map(p => p.proposal);
      }
    });
  }
});