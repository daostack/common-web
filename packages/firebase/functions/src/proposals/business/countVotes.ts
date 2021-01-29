import { ArgumentError } from '../../util/errors';

import { IProposalEntity } from '../proposalTypes';
import { VoteOutcome } from '../voteTypes';

export interface ICalculatedVotes {
  votesFor: number;
  votesAgainst: number;

  outcome: VoteOutcome;
}

/**
 * Calculates the votes for given proposal
 *
 * @param proposal - The proposal, for which we want to calculate the votes
 *
 * @throws { ArgumentError } - If the passed proposal is with falsy value
 *
 * @returns The counted votes and the voting outcome
 */
export const countVotes = (proposal: IProposalEntity): ICalculatedVotes => {
  if(!proposal) {
    throw new ArgumentError('proposal', proposal);
  }

  const votes: ICalculatedVotes = {
    votesAgainst: 0,
    votesFor: 0,
    outcome: null
  };

  proposal.votes.forEach((vote) => {
    if(vote.voteOutcome === 'approved') {
      votes.votesFor += 1;
    } else {
      votes.votesAgainst += 1;
    }
  });

  votes.outcome = votes.votesFor > votes.votesAgainst && votes.votesFor > 0
    ? 'approved'
    : 'rejected';

  return votes;
};