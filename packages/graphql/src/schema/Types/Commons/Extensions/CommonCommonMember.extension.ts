import { extendType, intArg, arg } from 'nexus';
import { prisma } from '@common/core';

export const CommonCommonMemberExtension = extendType({
  type: 'Common',
  definition(t) {
    t.nonNull.list.field('members', {
      type: 'CommonMember',
      args: {
        take: intArg({
          default: undefined
        }),
        skip: intArg({
          default: undefined
        }),
        orderBy: arg({
          type: 'CommonMemberOrderByInput',
          default: undefined
        })
      },
      resolve: async (root, args) => {
        return prisma.common
          .findUnique({
            where: {
              id: root.id
            }
          })
          .members({
            take: args.take || undefined,
            skip: args.skip || undefined,
            orderBy: (args.orderBy as any) || undefined
          });
      }
    });
  }
});