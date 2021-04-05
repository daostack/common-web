import Queue, { JobOptions } from 'bull';
import { setQueues, BullAdapter } from 'bull-board';

import { logger, voteService } from '@common/core';

import { Queues } from '../constants/Queues';

// Create the job spec
interface IVotesQueueJob {
  voteId: string;
};

type VotesQueueJob = 'processVote';

// Create the queue
const VotesQueue = Queue<IVotesQueueJob>(Queues.VotesQueue);

// Add the queue to the UI
setQueues([
  new BullAdapter(VotesQueue)
]);

// Create a way to add jobs to the queue
export const addVotesJob = (job: VotesQueueJob, voteId: string, options?: JobOptions): void => {
  logger.debug('New votes job was added', {
    job,
    voteId,
    options
  });

  VotesQueue.add(job, {
    voteId
  }, {
    ...options
  });
};

// Process the queue jobs
VotesQueue.process('processVote', async (job, done) => {
  logger.debug('Starting vote processing job', { job });

  await voteService.process(job.data.voteId);

  logger.debug('Processed vote processing job', { job });

  done();
});