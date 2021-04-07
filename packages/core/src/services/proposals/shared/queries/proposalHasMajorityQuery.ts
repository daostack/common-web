import { prisma } from '@toolkits';

import { voteService } from '@services';

export const proposalHasMajorityQuery = async (proposalId: string): Promise<boolean> => {
  const count = await voteService.getVotesCount(proposalId);

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