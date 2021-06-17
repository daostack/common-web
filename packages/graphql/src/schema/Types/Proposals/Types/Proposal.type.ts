import { objectType } from 'nexus';
import { authorizationService, voteService } from '@common/core';

export const ProposalType = objectType({
  name: 'Proposal',
  definition(t) {
    t.nonNull.id('id', {
      description: 'The main identifier of the item'
    });

    t.nonNull.date('createdAt', {
      description: 'The date, at which the item was created'
    });

    t.nonNull.date('updatedAt', {
      description: 'The date, at which the item was last modified'
    });

    t.nonNull.field('type', {
      type: 'ProposalType'
    });

    t.nonNull.field('state', {
      type: 'ProposalState'
    });

    t.nonNull.field('flag', {
      type: 'ReportFlag'
    });

    t.json('links');
    t.json('files');
    t.json('images');

    t.nonNull.int('votesFor');
    t.nonNull.int('votesAgainst');

    t.nonNull.date('expiresAt');

    t.string('title');
    t.string('description');

    t.string('ipAddress', {
      authorize: async (root, args, ctx) => {
        return authorizationService.can(await ctx.getUserId(), 'admin.proposals.read.ipAddress');
      },
      description: 'The IP from which the proposal was created'
    });

    t.nonNull.boolean('canVote', {
      complexity: 50,
      resolve: async (root, args, ctx) => {
        const userId = await ctx.getUserId();

        return voteService.canVote(userId, root.id);
      }
    });
  }
});