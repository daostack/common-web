import { statisticService } from '@common/core';
import { EventHandler } from './index';

export const onUserCreated: EventHandler = async (data, event) => {
  if (event.type === 'UserCreated') {
    // Update the statistics
    await statisticService.updateAll({
      users: {
        increment: 1
      }
    });
  }
};