import { extendType, arg, nonNull } from 'nexus';
import { prisma } from '@common/core';

export const GetCommonQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('common', {
      type: 'Common',
      complexity: 10,
      args: {
        where: nonNull(
          arg({
            type: 'CommonWhereUniqueInput'
          })
        )
      },
      resolve: (root, args) => {
        return prisma.common.findUnique({
          where: args.where
        });
      }
    });
  }
});
