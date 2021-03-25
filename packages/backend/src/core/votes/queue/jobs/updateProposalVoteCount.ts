import { IVotingQueue } from '../definition';

export const UpdateProposalVoteCount = 'Common.Queue.Votes.UpdateProposalVoteCount';

export const registerUpdateProposalVoteCountProcessor = (queue: IVotingQueue): void => {
  queue.process(UpdateProposalVoteCount, async (job, done) => {


    done();
  });
};