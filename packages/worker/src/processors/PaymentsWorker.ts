import { paymentService, logger } from '@common/core';
import { Queues } from '../queues';

// Process the jobs
Queues.PaymentsQueue.process((job, done) => {
  logger.error('Unnamed payment job occurred', {
    job
  });

  done();
});

Queues.PaymentsQueue.process('process', async (job, done) => {
  // Create log about the processing
  logger.debug('Starting processing of finalized payment');

  job.progress(3);

  // Do the actual processing
  await paymentService.process(job.data.paymentId);

  job.progress(99);

  // Create log about the processing result
  logger.debug('Finished processing of finalized payment');

  job.progress(100);

  done();
});

Queues.PaymentsQueue.process('updateStatus', async (job, done) => {
  // Create log about the processing result
  logger.debug('Starting payment status update job', { job });

  await paymentService.updateStatus(job.data.paymentId);

  // Create log about the processing
  logger.debug('Processed payment status update job', { job });

  done();
});