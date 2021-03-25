import { Vote, VoteOutcome } from '@prisma/client';
import { prisma } from '@toolkits';

export const updateProposalVoteCountsCommand = async (vote: Vote): Promise<void> => {
  await prisma.proposalDescription.update({
    where: {
      id: vote.proposalDescriptionId
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