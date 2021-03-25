import { Vote, VoteOutcome } from '@prisma/client';
import { prisma } from '@toolkits';
import { sleep } from '@utils';

export const updateProposalVoteCountsCommand = async (vote: Vote): Promise<void> => {
  await sleep(1000 * 30);

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