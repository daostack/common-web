import { logger, payoutsService } from '@common/core';
import { Queues } from '../queues';

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