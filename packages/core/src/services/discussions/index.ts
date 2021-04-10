import { createDiscussionCommand } from './core/commands/createDiscussionCommand';

export const discussionService = {
  /**
   * Create new discussion for the common,
   * or for proposal
   */
  create: createDiscussionCommand,

  messages: {}
};