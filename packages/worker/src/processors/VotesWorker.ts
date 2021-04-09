import { setQueues, BullAdapter } from 'bull-board';

import { Queues } from '@common/queues';
import { voteService, logger } from '@common/core';

// Add the queue to the UI
setQueues([
  new BullAdapter(Queues.VotesQueue)
]);

// Process the queue jobs
Queues.VotesQueue.process('processVote', async (job, done) => {
  logger.debug('Starting vote processing job', { job });

  await voteService.process(job.data.voteId);

  logger.debug('Processed vote processing job', { job });

  done();
});