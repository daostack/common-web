import { IVotingQueue } from '../definition';

import { proposalsService } from '../../../index';
import { logger } from '@logger';

export const UpdateProposalVoteCount = 'Common.Queue.Votes.UpdateProposalVoteCount';

export const registerUpdateProposalVoteCountProcessor = (queue: IVotingQueue): void => {
  queue.process(UpdateProposalVoteCount, async (job, done) => {
    const { vote } = job.data;

    // Update the votes count
    await proposalsService.updateVoteCount(vote);

    if (await proposalsService.hasMajority(vote.proposalId)) {
      logger.info('Finalizing proposal reached majority');

      // If the proposal has majority finalize it
      await proposalsService.finalize(job.data.vote.proposalId);
    }

    done();
  });
};