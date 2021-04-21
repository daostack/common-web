import { arg, extendType, idArg, nonNull } from 'nexus';
import { discussionService, authorizationService } from '@common/core';

export const ChangeDiscussionSubscriptionTypeMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('changeDiscussionSubscriptionType', {
      type: 'DiscussionSubscription',
      args: {
        id: nonNull(
          idArg({
            description: 'The ID of the discussion subscription to change'
          })
        ),
        type: nonNull(
          arg({
            type: 'DiscussionSubscriptionType',
            description: 'The new subscription type'
          })
        )
      },
      authorize: async (root, args, ctx) => {
        const userId = await ctx.getUserId();

        return authorizationService.discussions.canChangeSubscription(
          args.id,
          userId
        );
      },
      resolve: async (root, args) => {
        return discussionService.subscription.changeType(args);
      }
    });
  }
});