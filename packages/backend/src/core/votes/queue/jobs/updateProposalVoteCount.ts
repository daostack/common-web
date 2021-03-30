import { IVotingQueue } from '../definition';

import { proposalsService } from '@services';
import { logger } from '@logger';

export const UpdateProposalVoteCount = 'Common.Queue.Votes.UpdateProposalVoteCount';

export const registerUpdateProposalVoteCountProcessor = (queue: IVotingQueue): void => {
  queue.process(UpdateProposalVoteCount, async (job, done) => {
    // Update the votes count
    await proposalsService.updateVoteCount(job.data.vote);

    if (await proposalsService.hasMajority(job.data.vote.proposalId)) {
      logger.info('Finalizing proposal reached majority');

      // If the proposal has majority finalize it
      await proposalsService.finalize(job.data.vote.proposalId);
    }

    done();
  });
};