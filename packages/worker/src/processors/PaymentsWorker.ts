import { setQueues, BullAdapter } from 'bull-board';

import { Queues } from '@common/queues';
import { paymentService, logger } from '@common/core';


// Add to the UI
setQueues([
  new BullAdapter(Queues.PaymentsQueue)
]);

// Process the jobs
Queues.PaymentsQueue.process((job, done) => {
  logger.error('Unnamed payment job occurred', {
    job
  });

  done();
});

Queues.PaymentsQueue.process('process', (job, done) => {
  // @todo Create log about the processing

  // @todo

  // @todo Create log about the processing result
});

Queues.PaymentsQueue.process('updateStatus', async (job, done) => {
  // @todo Create log about the processing result
  logger.debug('Starting payment status update job', { job });

  await paymentService.updateStatus(job.data.paymentId);

  // @todo Create log about the processing
  logger.debug('Processed payment status update job', { job });

  done();
});