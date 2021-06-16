import { Event } from '@prisma/client';

import { statisticService } from '@common/core';

import { Queues } from '../queues';

Queues.EventQueue.on('completed', async (job, result: Event) => {
  if (result.type === 'DiscussionCreated') {
    // Update the statistics
    await statisticService.updateAll({
      discussions: {
        increment: 1
      }
    });
  }
});