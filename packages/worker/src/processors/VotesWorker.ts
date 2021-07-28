import { voteService, logger } from '@common/core';
import { Queues } from '../queues';


// Process the queue jobs
Queues.VotesQueue.process('processVote', async (job, done) => {
  logger.debug('Starting vote processing job', { job });

  await voteService.process(job.data.voteId);

  logger.debug('Processed vote processing job', { job });

  done();
});