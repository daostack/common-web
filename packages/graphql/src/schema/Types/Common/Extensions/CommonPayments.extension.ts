import { extendType, arg } from 'nexus';
import { prisma, authorizationService } from '@common/core';

export const CommonPaymentsExtension = extendType({
  type: 'Common',
  definition(t) {
    t.nonNull.list.nonNull.field('payments', {
      type: 'Payment',
      description: 'List of payments made for funding this common',
      args: {
        where: 'PaymentsWhereInput',
        paginate: arg({
          type: 'PaginateInput',
          default: {
            take: 10,
            skip: 0
          }
        })
      },
      authorize: async (root, args, ctx) => {
        return authorizationService.can(await ctx.getUserId(), 'admin.commons.read.payments');
      },
      resolve: (root, args) => {
        return prisma.common
          .findUnique({
            where: {
              id: root.id
            }
          })
          .payments({
            orderBy: {
              createdAt: 'desc'
            },
            where: args.where!,
            ...args.paginate
          });
      }
    });
  }
});