import { extendType, intArg, arg } from 'nexus';
import { prisma } from '@common/core';

export const UserProposalsExtension = extendType({
  type: 'User',
  definition(t) {
    t.nonNull.list.nonNull.field('proposals', {
      type: 'Proposal',
      complexity: 20,
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
        return prisma.user
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