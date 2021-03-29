import { VoteOutcome } from '@prisma/client';
import { prisma } from '@toolkits';

interface IVotesCount {
  votesFor: number;
  votesAgainst: number;
}

const initialVotesCount: IVotesCount = {
  votesAgainst: 0,
  votesFor: 0
};

export const proposalHasMajorityQuery = async (proposalId: string): Promise<boolean> => {
  // Find all the votes for the proposal
  const votes = await prisma.vote.findMany({
    where: {
      proposalId
    },
    select: {
      outcome: true
    }
  });

  // Count the found votes
  const count = votes.reduce<IVotesCount>((count, vote) => {
    return vote.outcome === VoteOutcome.Condemn ? {
      ...count,
      votesAgainst: count.votesAgainst + 1
    } : {
      ...count,
      votesFor: count.votesFor + 1
    };
  }, initialVotesCount);

  console.time('Member count query');

  const memberCount = await prisma.commonMember.count({
    where: {
      common: {
        proposals: {
          some: {
            id: proposalId
          }
        }
      }
    }
  });

  console.timeEnd('Member count query');

  return Math.ceil(memberCount / 2) > count.votesFor ||
    Math.ceil(memberCount / 2) > count.votesAgainst;
};