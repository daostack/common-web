import { setQueues, BullAdapter } from 'bull-board';

import { Queues } from '@common/queues';
import { logger, payoutsService } from '@common/core';

// Setup the queue UI
setQueues([
  new BullAdapter(Queues.PayoutsQueue)
]);

// Process the jobs
Queues.PayoutsQueue.process('execute', async (job, done) => {
  logger.debug('Starting execute payout job', { job });

  try {
    const updatedProposal = await payoutsService.execute(job.data.payoutId);

    logger.debug('Successfully executed payout.', {
      job,
      updatedProposal
    });

    done(null, updatedProposal);
  } catch (e) {
    done(e);
  }
});

// Process the jobs
Queues.PayoutsQueue.process('update', async (job, done) => {
  logger.debug('Starting update payout job', { job });

  try {
    const updatedProposal = await payoutsService.updateStatus(job.data.payoutId);

    logger.debug('Successfully updated payout.', {
      job,
      updatedProposal
    });

    done(null, updatedProposal);
  } catch (e) {
    done(e);
  }
});