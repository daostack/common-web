import { prisma } from '@toolkits';

/**
 * Checks if the current limit for discussions for proposal
 * has been reached
 *
 * @param proposalId - The ID of the proposal for which we are creating new discussion
 */
export const canCreateProposalDiscussionQuery = async (proposalId: string): Promise<boolean> => {
  const maximumAllowed = process.env['Constraints.Discussions.MaxPerProposal'] || 5;
  const currentDiscussionCount = await prisma.discussion.count({
    where: {
      proposalId
    }
  });

  return currentDiscussionCount < maximumAllowed;
};