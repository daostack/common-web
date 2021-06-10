import { createDiscussionCommand } from './core/commands/createDiscussionCommand';

import { createDiscussionSubscriptionCommand } from './subscriptions/createDiscussionSubscriptionCommand';
import { changeDiscussionSubscriptionTypeCommand } from './subscriptions/changeDiscussionSubscriptionTypeCommand';

import { createDiscussionMessageCommand } from './messages/createDiscussionMessageCommand';

export const discussionService = {
  /**
   * Create new discussion for the common,
   * or for proposal
   */
  create: createDiscussionCommand,

  subscription: {
    /**
     * Create notification subscription for discussion
     */
    create: createDiscussionSubscriptionCommand,

    /**
     * Updates the Types of the subscription in the backing store. Please note
     * that this function does not check if the user has permission to update
     * the specified subscription
     */
    changeType: changeDiscussionSubscriptionTypeCommand
  },

  messages: {
    /**
     * Create new message in discussion
     */
    create: createDiscussionMessageCommand
  }
};