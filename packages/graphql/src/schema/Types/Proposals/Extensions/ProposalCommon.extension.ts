import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const ProposalCommonExtension = extendType({
  type: 'Proposal',
  definition(t) {
    t.nonNull.uuid('commonId');

    t.nonNull.field('common', {
      type: 'Common',
      resolve: async (root) => {
        return (await prisma.proposal
          .findUnique({
            where: {
              id: root.id
            }
          })
          .common())!;
      }
    });
  }
});