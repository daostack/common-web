import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const ProposalJoinExtension = extendType({
  type: 'Proposal',
  definition(t) {
    t.uuid('joinId');

    t.field('join', {
      type: 'JoinProposal',
      resolve: (root) => {
        if (!root.joinId) {
          return null;
        }

        return prisma.joinProposal
          .findUnique({
            where: {
              id: root.joinId
            }
          });
      }
    });
  }
});