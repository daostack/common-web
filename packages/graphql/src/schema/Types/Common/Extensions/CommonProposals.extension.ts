import { extendType, arg } from 'nexus';
import { prisma } from '@common/core';

export const CommonProposalsExtension = extendType({
  type: 'Common',
  definition(t) {
    t.nonNull.list.nonNull.field('proposals', {
      type: 'Proposal',
      args: {
        paginate: arg({
          type: 'PaginateInput'
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
            skip: args.paginate?.skip || undefined,
            take: args.paginate?.take || undefined,
            where: (args.where as any) || undefined
          });
      }
    });
  }
});