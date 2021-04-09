import Queue, { JobOptions } from 'bull';
import { setQueues, BullAdapter } from 'bull-board';

import { Queues } from '../constants/Queues';

import { logger, paymentService } from '@common/core';


// Create the job speck
export interface IPaymentsQueueJob {
  /**
   * The ID of the payment that we are going to be processing
   */
  paymentId: string;
}

export type PaymentsQueueJob = 'process' | 'updateStatus';

// Create the queue
export const PaymentsQueue = Queue<IPaymentsQueueJob>(Queues.PaymentsQueue);


// Create a way to add jobs
export const addPaymentJob = (job: PaymentsQueueJob, paymentId: string, options?: JobOptions): void => {
  logger.debug('New payment job was added', {
    job,
    options,
    paymentId
  });

  PaymentsQueue.add(job, {
    paymentId
  }, {
    timeout: 1000 * 60 * 10, // 10 minutes
    ...options
  });
};
