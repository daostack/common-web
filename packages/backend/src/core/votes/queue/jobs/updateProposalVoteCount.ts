import { IVotingQueue } from '../definition';
import { proposalsService } from '@services';
import { proposalHasMajorityQuery } from '../../../proposals/shared/queries/proposalHasMajorityQuery';

export const UpdateProposalVoteCount = 'Common.Queue.Votes.UpdateProposalVoteCount';

export const registerUpdateProposalVoteCountProcessor = (queue: IVotingQueue): void => {
  queue.process(UpdateProposalVoteCount, async (job, done) => {
    // Update the votes count
    await proposalsService.updateVoteCount(job.data.vote);

    if (await proposalHasMajorityQuery(job.data.vote.proposalDescriptionId)) {
      // Finalize the proposal
    }

    done();
  });
};