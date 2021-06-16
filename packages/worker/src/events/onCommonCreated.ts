import { Event } from '@prisma/client';

import { statisticService, logger } from '@common/core';
import { Queues } from '../queues';

Queues.EventQueue.on('completed', async (job, result: Event) => {
  if (result.type === 'CommonCreated') {
    logger.info('Executing `onCommonCreated`');

    // Update the statistics
    await statisticService.updateAll({
      commons: {
        increment: 1
      }
    });
  }
});