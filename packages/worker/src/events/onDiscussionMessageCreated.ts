import { Event } from '@prisma/client';

import { statisticService } from '@common/core';

import { Queues } from '../queues';

Queues.EventQueue.on('completed', async (job, result: Event) => {
  if (result.type === 'DiscussionMessageCreated') {
    // Update the statistics
    await statisticService.updateAll({
      discussionMessages: {
        increment: 1
      }
    });
  }
});