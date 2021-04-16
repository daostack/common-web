import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const NotificationProposalExtension = extendType({
  type: 'Notification',
  definition(t) {
    t.uuid('proposalId', {
      description: 'The ID of the linked proposal. May be null'
    });

    t.field('proposal', {
      type: 'Proposal',
      complexity: 10,
      description: 'The linked proposal. Expensive operation that may return null',
      resolve: (root) => {
        return ((root as any).proposal) || prisma.proposal.findUnique({
          where: {
            id: root.id
          }
        });
      }
    });
  }
});