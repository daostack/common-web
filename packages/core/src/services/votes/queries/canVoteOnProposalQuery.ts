import { prisma } from '@toolkits';

export const canVoteOnProposalQuery = async (userId: string, proposalId: string): Promise<boolean> => {
  // Find the proposal and everything
  const proposal = await prisma.proposal
    .findUnique({
      where: {
        id: proposalId
      },
      include: {
        common: {
          select: {
            members: {
              where: {
                userId
              },
              include: {
                votes: {
                  where: {
                    proposalId
                  }
                }
              }
            }
          }
        }
      }
    });


  return (
    !!proposal &&
    !!proposal.common.members.length &&
    !proposal.common.members[0].votes.length
  );
};