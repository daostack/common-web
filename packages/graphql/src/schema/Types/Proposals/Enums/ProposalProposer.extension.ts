import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const ProposalProposerExtension = extendType({
  type: 'Proposal',
  definition(t) {
    t.nonNull.id('userId', {
      description: 'The ID of the user who created the proposal'
    });

    t.nonNull.uuid('commonMemberId', {
      description: 'The ID of the membership of the user who created the proposal'
    });

    t.nonNull.field('user', {
      type: 'User',
      resolve: async (root) => {
        return (await prisma.proposal
          .findUnique({
            where: {
              id: root.id
            }
          })
          .user())!;
      }
    });

    t.nonNull.field('member', {
      type: 'CommonMember',
      resolve: async (root) => {
        return (await prisma.proposal
          .findUnique({
            where: {
              id: root.id
            }
          })
          .commonMember())!;
      }
    });
  }
});