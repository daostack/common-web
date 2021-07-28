import { Vote, VoteOutcome } from '@prisma/client';

import { prisma } from '@toolkits';
import { NotFoundError } from '@errors';

export const updateProposalVoteCountsCommand = async (vote: Vote | string): Promise<void> => {
  if (typeof vote === 'string') {
    vote = (await prisma.vote.findUnique({
      where: {
        id: vote
      }
    }))!;

    if (!vote) {
      throw new NotFoundError('vote', vote);
    }
  }

  await prisma.proposal.update({
    where: {
      id: vote.proposalId
    },
    data: vote.outcome === VoteOutcome.Approve
      ? {
        votesFor: {
          increment: 1
        }
      } : {
        votesAgainst: {
          increment: 1
        }
      }
  });
};