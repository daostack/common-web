import * as z from 'zod';
import { StatisticType, Statistic } from '@prisma/client';

import { logger } from '@logger';
import { prisma } from '@toolkits';
import { statisticsUpdate } from '../helpers/validator';


export const updateCurrentStatistics = async (type: StatisticType, change: z.infer<typeof statisticsUpdate>): Promise<Statistic> => {
  // Validate the change
  statisticsUpdate.parse(change);

  // Get the last statistic of that type
  let statistics = await prisma.statistic
    .findFirst({
      where: {
        type
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

  // If the statistics are not found create new
  if (!statistics) {
    statistics = await prisma.statistic
      .create({
        data: {
          type
        }
      });
  }

  // Update the statistics
  const updatedStatistics = await prisma.statistic
    .update({
      where: {
        id: statistics.id
      },
      data: change
    });

  logger.info('Successfully update statistics', {
    updatedStatistics,
    statistics
  });

  // Return the updated statistics
  return statistics;
};