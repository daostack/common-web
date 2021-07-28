import { queryField, list, arg } from 'nexus';
import { prisma } from '@common/core';

export const GetCommonsQuery = queryField('commons', {
  type: list('Common'),
  args: {
    paginate: arg({
      type: 'PaginateInput'
    }),

    where: arg({
      type: 'CommonWhereInput'
    })
  },
  resolve: (root, args) => {
    return prisma.common
      .findMany({
        skip: args.paginate?.skip || undefined,
        take: args.paginate?.take || undefined,
        where: args.where as any || undefined
      });
  }
});
