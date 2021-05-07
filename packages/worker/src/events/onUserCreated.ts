import { Event } from '@prisma/client';

import { Queues } from '@common/queues';
import { statisticService } from '@common/core';

Queues.EventQueue.on('completed', async (job, result: Event) => {
  if (result.type === 'UserCreated') {
    // Update the statistics
    await statisticService.updateAllTime({
      users: {
        increment: 1
      }
    });
  }
});