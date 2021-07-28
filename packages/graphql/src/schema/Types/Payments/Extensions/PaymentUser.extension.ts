import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const PaymentUserExtension = extendType({
  type: 'Payment',
  definition(t) {
    t.nonNull.string('userId');

    t.nonNull.field('user', {
      type: 'User',
      resolve: async (root) => {
        return (await prisma.user
          .findUnique({
            where: {
              id: root.userId
            }
          }))!;
      }
    });
  }
});