import { prisma } from '@toolkits';
import { logger } from '@logger';
import { StatisticType } from '@prisma/client';

export const forceUpdateAllTimeStatistics = async () => {
  logger.info('Force updating all time statistics');

  const fundingProposals = await prisma.proposal.count({
    where: {
      type: 'FundingRequest'
    }
  });

  const joinProposals = await prisma.proposal.count({
    where: {
      type: 'JoinRequest'
    }
  });

  const paymentsCount = await prisma.payment.count();
  const discussionsCount = await prisma.discussion.count();
  const messagesCount = await prisma.discussionMessage.count();
  const commonCount = await prisma.common.count();
  const userCount = await prisma.user.count();

  logger.info(`Force updated data`, {
    fundingProposals,
    joinProposals,
    discussionsCount,
    messagesCount,
    paymentsCount,
    commonCount,
    userCount
  });

  await prisma.statistic.updateMany({
    where: {
      type: StatisticType.AllTime
    },
    data: {
      payments: paymentsCount,
      users: userCount,
      commons: commonCount,
      discussions: discussionsCount,
      discussionMessages: messagesCount,
      fundingProposals,
      joinProposals
    }
  });
};