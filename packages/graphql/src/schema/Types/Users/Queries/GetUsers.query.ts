import { queryField, list, arg } from 'nexus';
import { prisma } from '@common/core';

export const GetUsersQuery = queryField('users', {
  type: list('User'),
  args: {
    where: arg({
      type: 'UserWhereInput'
    }),
    paginate: arg({
      type: 'PaginateInput'
    })
  },
  resolve: (root, args) => {
    return prisma.user
      .findMany({
        where: args
      });
  }
});