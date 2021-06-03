import { logger, subscriptionService } from '@common/core';
import { Queues } from '../queues';


// Process the queue jobs
Queues.SubscriptionsQueue.process('charge', async (job, done) => {
  logger.debug('Starting vote processing job', { job });

  await subscriptionService.createPayment(job.data.subscriptionId);

  logger.debug('Processed vote processing job', { job });

  done();
});