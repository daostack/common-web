import { statisticService } from '@common/core';
import { EventHookHandler } from './index';

export const onDiscussionCreated: EventHookHandler = async (data, event) => {
  if (event.type === 'DiscussionCreated') {
    // Update the statistics
    await statisticService.updateAll({
      discussions: {
        increment: 1
      }
    });
  }
};