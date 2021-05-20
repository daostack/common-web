import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const PaymentCommonExtension = extendType({
  type: 'Payment',
  definition(t) {
    t.nonNull.string('commonId');

    t.nonNull.field('common', {
      type: 'Common',
      resolve: async (root) => {
        return (await prisma.common
          .findUnique({
            where: {
              id: root.commonId
            }
          }))!;
      }
    });
  }
});