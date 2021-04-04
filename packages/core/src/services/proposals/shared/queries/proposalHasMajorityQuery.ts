import { prisma } from '@toolkits';

import { getProposalVoteCountQuery } from 'packages/core/src/services/votes/queries/getProposalVoteCountQuery';

export const proposalHasMajorityQuery = async (proposalId: string): Promise<boolean> => {
  const count = await getProposalVoteCountQuery(proposalId);

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