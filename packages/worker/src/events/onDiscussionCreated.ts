import { statisticService } from '@common/core';
import { EventHandler } from './index';

export const onDiscussionCreated: EventHandler = async (data, event) => {
  if (event.type === 'DiscussionCreated') {
    // Update the statistics
    await statisticService.updateAll({
      discussions: {
        increment: 1
      }
    });
  }
};