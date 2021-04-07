import { logger } from '@logger';
import { prisma } from '@toolkits';
import { NotFoundError } from '@errors';
import { proposalService } from '@services';

export const processVoteCommand = async (voteId: string): Promise<void> => {
  const vote = await prisma.vote.findUnique({
    where: {
      id: voteId
    }
  });

  if (!vote) {
    throw new NotFoundError('vote', voteId);
  }

  // Update the votes count
  await proposalService.updateVoteCount(vote);

  if (await proposalService.hasMajority(vote.proposalId)) {
    logger.info('Finalizing proposal reached majority');

    // If the proposal has majority finalize it
    await proposalService.finalize(vote.proposalId);
  }

};