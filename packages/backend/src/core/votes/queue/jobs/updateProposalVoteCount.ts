import { IVotingQueue } from '../definition';
import { proposalsService } from '@services';

export const UpdateProposalVoteCount = 'Common.Queue.Votes.UpdateProposalVoteCount';

export const registerUpdateProposalVoteCountProcessor = (queue: IVotingQueue): void => {
  queue.process(UpdateProposalVoteCount, async (job, done) => {
    // Update the votes count
    await proposalsService.updateVoteCount(job.data.vote);

    done();
  });
};