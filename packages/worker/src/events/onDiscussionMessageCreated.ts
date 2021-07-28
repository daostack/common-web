import { statisticService } from '@common/core';
import { EventHookHandler } from './index';

export const onDiscussionMessageCreated: EventHookHandler = async (data, event) => {
  if (event.type === 'DiscussionMessageCreated') {
    // Update the statistics
    await statisticService.updateAll({
      discussionMessages: {
        increment: 1
      }
    });
  }
};