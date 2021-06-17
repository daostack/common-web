import Queue, { JobOptions } from 'bull';

import { Queues } from '@constants';
import { logger } from '@logger';

// Create the job spec
export interface IProposalsQueueJob {
  proposalId: string;
}

export type ProposalsQueueJob = 'finalizeProposal';

// Create the queue
export const ProposalsQueue = Queue<IProposalsQueueJob>(Queues.ProposalsQueue, {
  redis: {
    host: process.env['REDIS_HOST'],
    port: Number(process.env['REDIS_PORT']),
    username: process.env['REDIS_USERNAME'],
    password: process.env['REDIS_PASSWORD']
  }
});

// Create a way to add jobs to the queue
export const addProposalsJob = (job: ProposalsQueueJob, proposalId: string, options?: JobOptions): void => {
  logger.debug('New proposals job was added', {
    job,
    proposalId,
    options
  });

  ProposalsQueue.add(job, {
    proposalId
  }, {
    ...options
  });
};
