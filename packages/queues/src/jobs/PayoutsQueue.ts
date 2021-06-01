import Queue, { JobOptions } from 'bull';

import { logger } from '@common/core';
import { Queues } from '../constants/Queues';

// Create the job speck
export interface IPayoutsQueueJob {
  /**
   * The ID of the payout that we are going to be processing
   */
  payoutId: string;
}

export type PayoutsQueueJob = 'execute' | 'update';

// Create the queue
export const PayoutsQueue = Queue<IPayoutsQueueJob>(Queues.PayoutsQueue);


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
