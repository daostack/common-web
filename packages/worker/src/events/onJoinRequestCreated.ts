import { EventHandler } from './index';
import { statisticService } from '@common/core';

export const onJoinRequestCreated: EventHandler = async (data, event) => {
  if (event.type === 'JoinRequestCreated') {
    // Update the statistics
    await statisticService.updateAll({
      joinProposals: {
        increment: 1
      }
    });
  }
};