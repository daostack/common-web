import { inputObjectType, extendType, nonNull, arg } from 'nexus';
import { discussionService } from '@common/core';

export const CreateDiscussionMessageInput = inputObjectType({
  name: 'CreateDiscussionMessageInput',
  definition(t) {
    t.nonNull.id('discussionId', {
      description: 'The ID of the discussion, for which we are creating the message'
    });

    t.nonNull.string('message', {
      description: 'The message itself'
    });
  }
});

export const CreateDiscussionMessageMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createDiscussionMessage', {
      type: 'DiscussionMessage',
      args: {
        input: nonNull(
          arg({
            type: 'CreateDiscussionMessageInput'
          })
        )
      },
      resolve: async (root, args, ctx) => {
        const userId = await ctx.getUserId();

        return discussionService.messages.create({
          ...args.input,
          userId
        });
      }
    });
  }
});