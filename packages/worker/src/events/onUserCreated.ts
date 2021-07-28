import { statisticService } from '@common/core';
import { EventHookHandler } from './index';

export const onUserCreated: EventHookHandler = async (data, event) => {
  if (event.type === 'UserCreated') {
    // Update the statistics
    await statisticService.updateAll({
      users: {
        increment: 1
      }
    });
  }
};