import { Event } from '@prisma/client';

import { Queues } from '@common/queues';
import { statisticService, logger } from '@common/core';

Queues.EventQueue.on('completed', async (job, result: Event) => {
  if (result.type === 'CommonCreated') {
    logger.info('Executing `onCommonCreated`');

    // Update the statistics
    await statisticService.updateAllTime({
      commons: {
        increment: 1
      }
    });
  }
});