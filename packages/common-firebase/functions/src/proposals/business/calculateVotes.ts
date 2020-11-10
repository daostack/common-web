import { IProposalEntity } from '../proposalTypes';
import { ArgumentError } from '../../util/errors';

export interface ICalculatedVotes {
  votesFor: number;
  votesAgainst: number;
}

/**
 * Calculates the votes for given proposal
 *
 * @param proposal - The proposal, for witch we want to calculate the votes
 *
 * @throws { ArgumentError } - If the passed proposal is with falsy value
 *
 * @returns The calculated votes
 */
export const calculateVotes = (proposal: IProposalEntity): ICalculatedVotes => {
  if(!proposal) {
    throw new ArgumentError('proposal', proposal);
  }

  const votes: ICalculatedVotes = {
    votesAgainst: 0,
    votesFor: 0
  };

  proposal.votes.forEach((vote) => {
    if(vote.voteOutcome === 'approved') {
      votes.votesFor += 1;
    } else {
      votes.votesAgainst += 1;
    }
  });

  return votes;
};