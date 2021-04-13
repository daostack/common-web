import { arg, extendType, idArg, nonNull } from 'nexus';
import { discussionService } from '@common/core';

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
      resolve: async (root, args) => {
        // @todo Authorization!!!!

        return discussionService.subscription.changeType(args);
      }
    });
  }
});