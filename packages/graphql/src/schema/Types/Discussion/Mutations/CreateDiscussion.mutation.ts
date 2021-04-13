import { extendType, inputObjectType, nonNull, arg } from 'nexus';
import { discussionService } from '@common/core';

export const CreateDiscussionInput = inputObjectType({
  name: 'CreateDiscussionInput',
  definition(t) {
    t.nonNull.string('topic', {
      description: 'The topic of the discussion to be created'
    });

    t.nonNull.string('description', {
      description: 'Short description about the topic'
    });

    t.nonNull.id('commonId', {
      description: 'The ID of the common, for which we are creating the discussion'
    });

    t.id('proposalId', {
      description: 'The ID of the proposal, if this is proposal discussion'
    });
  }
});

export const CreateDiscussionMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createDiscussion', {
      type: 'Discussion',
      args: {
        input: nonNull(
          arg({
            type: 'CreateDiscussionInput'
          })
        )
      },
      resolve: async (root, args, ctx) => {
        const userId = await ctx.getUserId();

        return discussionService.create({
          ...args.input,
          userId
        });
      }
    });
  }
});