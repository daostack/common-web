import { createDiscussionCommand } from './core/commands/createDiscussionCommand';
import { createDiscussionSubscriptionCommand } from './subscriptions/createDiscussionSubscriptionCommand';
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
    create: createDiscussionSubscriptionCommand
  },

  messages: {
    /**
     * Create new message in discussion
     */
    create: createDiscussionMessageCommand
  }
};