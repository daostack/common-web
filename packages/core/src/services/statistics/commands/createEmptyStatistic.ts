import { StatisticType, Statistic } from '@prisma/client';

import { logger } from '@logger';
import { prisma } from '@toolkits';
import { CommonError } from '@errors';

export const createEmptyStatistic = async (type: StatisticType): Promise<Statistic> => {
  // If we are trying to create all time check if it exists
  if (type === StatisticType.AllTime) {
    const allTimeCount = await prisma.statistic.count({
      where: {
        type
      }
    });

    if (allTimeCount) {
      throw new CommonError('Cannot create all time statistic when one exists');
    }
  }

  // Create the statistic
  const statistic = await prisma.statistic
    .create({
      data: {
        type
      }
    });

  logger.info(`New ${type} statistic was created`, {
    statistic
  });

  // Return the created statistic
  return statistic;
};