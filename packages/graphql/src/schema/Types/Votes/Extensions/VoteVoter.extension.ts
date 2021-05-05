import { extendType } from 'nexus';
import { prisma } from '@common/core';
import { Vote } from '@prisma/client';

export const VoteVoterExtension = extendType({
  type: 'Vote',
  definition(t) {
    t.nonNull.id('voterId', {
      resolve: (root) => {
        return (root as Vote).commonMemberId;
      }
    });

    t.nonNull.field('voter', {
      type: 'CommonMember',
      resolve: async (root) => {
        return (await prisma.vote
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