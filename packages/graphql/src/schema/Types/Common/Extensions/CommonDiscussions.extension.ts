import { extendType, intArg } from 'nexus';
import { prisma } from '@common/core';

export const CommonDiscussionsExtension = extendType({
  type: 'Common',
  definition(t) {
    t.nonNull.list.nonNull.field('discussions', {
      type: 'Discussion',
      args: {
        take: intArg(),
        skip: intArg()
      },
      resolve: (root, args) => {
        return prisma.common
          .findUnique({
            where: {
              id: root.id
            }
          })
          .discussions({
            take: args.take || 10,
            skip: args.skip || 0
          });
      }
    });
  }
});