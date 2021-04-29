import { extendType, nonNull, idArg } from 'nexus';
import { prisma } from '@common/core';

export const GetProposalsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('proposals', {
      type: 'Proposal',
      args: {
            id: nonNull(idArg())
      },
      resolve: async (root, args) => {
       return await prisma.common
          .findUnique({
            where: {
              id: args.id
            }
          });

          // eslint-disable-next-line no-console
          // console.log('commin', common);
          // return common;
      }
    });
  }
});