import { extendType, arg, intArg } from 'nexus';
import { prisma } from '@common/core';

export const CommonEventsExtension = extendType({
  type: 'Common',
  definition(t) {
    t.nonNull.list.nonNull.field('events', {
      type: 'Event',
      complexity: 20,
      description: 'List of events, that occurred in a common',
      args: {
        take: intArg({
          default: 10
        }),

        skip: intArg({
          default: 0
        }),

        orderBy: arg({
          type: 'EventOrderByInput'
        })
      },
      resolve: async (root, args) => {
        return prisma.common
          .findUnique({
            where: {
              id: root.id
            }
          })
          .events({
            take: args.take || undefined,
            skip: args.skip || undefined,
            orderBy: (args.orderBy as any) || undefined
          });
      }
    });
  }
});