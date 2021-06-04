import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const PayoutWireExtension = extendType({
  type: 'Payout',
  definition(t) {
    t.nonNull.field('wire', {
      type: 'Wire',
      resolve: async (root) => {
        return (await prisma.payout
          .findUnique({
            where: {
              id: root.id
            }
          })
          .wire())!;
      }
    });
  }
});