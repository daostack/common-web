import { VoteOutcome } from '@prisma/client';
import { prisma } from '@toolkits';

export interface IVotesCount {
  votesFor: number;
  votesAgainst: number;
}

const initialVotesCount: IVotesCount = {
  votesAgainst: 0,
  votesFor: 0
};

export const getProposalVoteCountQuery = async (proposalId: string): Promise<IVotesCount> => {
  // Find all the votes for the proposal
  const votes = await prisma.vote.findMany({
    where: {
      proposalId
    },
    select: {
      outcome: true
    }
  });

  // Count the found votes and return them
  return votes.reduce<IVotesCount>((count, vote) => {
    return vote.outcome === VoteOutcome.Condemn ? {
      ...count,
      votesAgainst: count.votesAgainst + 1
    } : {
      ...count,
      votesFor: count.votesFor + 1
    };
  }, initialVotesCount);
};