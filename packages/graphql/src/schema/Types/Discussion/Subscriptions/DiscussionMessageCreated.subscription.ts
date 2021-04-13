import { subscriptionField, nonNull, idArg } from 'nexus';
import { DiscussionMessage } from '@prisma/client';

import { pubSub } from '@common/core';

export const DiscussionMessageCreatedSubscription = subscriptionField('discussionMessageCreated', {
  type: 'DiscussionMessage',
  args: {
    discussionId: nonNull(
      idArg({
        description: 'The ID of the discussion, for which messages you want to subscribe'
      })
    )
  },
  subscribe(root, args) {
    return pubSub.asyncIterator<DiscussionMessage>(`Discussions.${args.discussionId}.NewMessage`);
  },
  resolve: (root: DiscussionMessage) => {
    return root;
  }
});