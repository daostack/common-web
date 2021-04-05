import Queue, { JobOptions } from 'bull';
import { setQueues, BullAdapter } from 'bull-board';

import { Queues } from '../constants/Queues';

import { logger, paymentService } from '@common/core';


// Create the job speck
interface IPaymentsQueueJob {
  /**
   * The ID of the payment that we are going to be processing
   */
  paymentId: string;
}

type PaymentsQueueJob = 'process' | 'updateStatus';

// Create the queue
const PaymentsQueue = Queue<IPaymentsQueueJob>(Queues.PaymentsQueue);

// Setup the queue UI
setQueues([
  new BullAdapter(PaymentsQueue)
]);

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
    ...options
  });
};

// Process the jobs
PaymentsQueue.process((job, done) => {
  logger.error('Unnamed payment job occurred', {
    job
  });

  done();
});

PaymentsQueue.process('process', (job, done) => {
  // @todo Create log about the processing

  // @todo

  // @todo Create log about the processing result
});

PaymentsQueue.process('updateStatus', async (job, done) => {
  // @todo Create log about the processing result
  logger.debug('Starting payment status update job', { job });

  await paymentService.updateStatus(job.data.paymentId);

  // @todo Create log about the processing
  logger.debug('Processed payment status update job', { job });

  done();
});