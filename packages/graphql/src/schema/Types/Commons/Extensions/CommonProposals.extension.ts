import { extendType, arg, intArg } from 'nexus';
import { prisma } from '@common/core';

export const CommonProposalsExtension = extendType({
  type: 'Common',
  definition(t) {
    t.nonNull.list.nonNull.field('proposals', {
      type: 'Proposal',
      args: {
        take: intArg({
          default: 10
        }),

        skip: intArg({
          default: 0
        }),

        where: arg({
          type: 'ProposalWhereInput'
        })
      },
      resolve: (root, args) => {
        return prisma.common
          .findUnique({
            where: {
              id: root.id
            }
          })
          .proposals({
            take: args.take || undefined,
            skip: args.skip || undefined,
            where: (args.where as any) || undefined
          });
      }
    });
  }
});