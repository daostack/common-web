import { Queues } from '../queues';
import { logger, proposalService } from '@common/core';

// Process the jobs
Queues.ProposalsQueue.process((job, done) => {
  logger.error('Unnamed payment job occurred', {
    job
  });

  done();
});

Queues.ProposalsQueue.process('finalizeProposal', async (job, done) => {
  // Create log about the processing
  logger.debug('Starting the process of finalizing proposal');

  job.progress(3);

  // Do the actual processing
  await proposalService.finalize(job.data.proposalId);

  job.progress(99);

  // Create log about the processing result
  logger.debug('Finished finalizing the proposal');

  job.progress(100);

  done();
});