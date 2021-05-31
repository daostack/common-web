import { queryField, list, arg } from 'nexus';
import { prisma, authorizationService } from '@common/core';

export const GetWiresQuery = queryField('wires', {
  type: list('Wire'),
  args: {
    where: arg({
      type: 'WireWhereInput'
    })
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.wire.read');
  },
  resolve: (root, { where }) => {
    return prisma.wire
      .findMany({
        where: where as any
      });
  }
});