import { statisticService } from '@common/core';
import { EventHandler } from './index';

export const onDiscussionMessageCreated: EventHandler = async (data, event) => {
  if (event.type === 'DiscussionMessageCreated') {
    // Update the statistics
    await statisticService.updateAll({
      discussionMessages: {
        increment: 1
      }
    });
  }
};