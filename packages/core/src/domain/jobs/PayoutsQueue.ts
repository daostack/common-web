import Queue, { JobOptions } from 'bull';

import { Queues } from '@constants';
import { logger } from '@logger';

// Create the job speck
export interface IPayoutsQueueJob {
  /**
   * The ID of the payout that we are going to be processing
   */
  payoutId: string;
}

export type PayoutsQueueJob = 'execute' | 'update';

// Create the queue
export const PayoutsQueue = Queue<IPayoutsQueueJob>(Queues.PayoutsQueue, {
  redis: {
    host: process.env['REDIS_HOST'],
    port: Number(process.env['REDIS_PORT']),
    username: process.env['REDIS_USERNAME'],
    password: process.env['REDIS_PASSWORD']
  }
});


// Create a way to add jobs
export const addPayoutJob = (job: PayoutsQueueJob, payoutId: string, options?: JobOptions): void => {
  logger.debug('New payout job was added', {
    job,
    options,
    payoutId
  });

  PayoutsQueue.add(job, {
    payoutId
  }, {
    timeout: 1000 * 60 * 10, // 10 minutes
    ...options
  });
};
