import { EventHookHandler } from './index';
import { statisticService } from '@common/core';

export const onJoinRequestCreated: EventHookHandler = async (data, event) => {
  if (event.type === 'JoinRequestCreated') {
    // Update the statistics
    await statisticService.updateAll({
      joinProposals: {
        increment: 1
      }
    });
  }
};