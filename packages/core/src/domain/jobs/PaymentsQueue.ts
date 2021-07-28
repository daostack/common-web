import Queue, { JobOptions } from 'bull';

import { Queues } from '@constants';
import { logger } from '@logger';


// Create the job speck
export interface IPaymentsQueueJob {
  /**
   * The ID of the payment that we are going to be processing
   */
  paymentId: string;
}

export type PaymentsQueueJob = 'process' | 'updateStatus';

// Create the queue
export const PaymentsQueue = Queue<IPaymentsQueueJob>(Queues.PaymentsQueue, {
  redis: {
    host: process.env['REDIS_HOST'],
    port: Number(process.env['REDIS_PORT']),
    username: process.env['REDIS_USERNAME'],
    password: process.env['REDIS_PASSWORD']
  }
});


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
