import { prisma } from '@common/core';
import { arg, list, queryField } from 'nexus';

export const GetDiscussionsQuery = queryField('discussions', {
  type: list('Discussion'),
      args: {
        where: arg({
            type: 'DiscussionWhereInput'
        }),
        paginate: arg({
            type: 'PaginateInput'
        })
      },
      resolve: (root, args) => {
        return prisma.discussion.findMany({
            where: args.where as any,
            ...args.paginate
        });
      }
  });