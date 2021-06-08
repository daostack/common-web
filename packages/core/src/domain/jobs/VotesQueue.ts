import Queue, { JobOptions } from 'bull';

import { Queues } from '@constants';
import { logger } from '@logger';


// Create the job spec
export interface IVotesQueueJob {
  voteId: string;
}

export type VotesQueueJob = 'processVote';

// Create the queue
export const VotesQueue = Queue<IVotesQueueJob>(Queues.VotesQueue);

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
