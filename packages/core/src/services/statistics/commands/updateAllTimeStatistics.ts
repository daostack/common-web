import * as z from 'zod';
import { StatisticType } from '@prisma/client';

import { prisma } from '@toolkits';
import { logger } from '@logger';

const intOperation = z.object({
  increment: z.number()
    .optional(),

  decrement: z.number()
    .optional()
}).optional();

const schema = z.object({
  commons: intOperation,
  users: intOperation
});

export const updateAllTimeStatistics = async (command: z.infer<typeof schema>): Promise<void> => {
  // Validate the command
  schema.parse(command);

  const globalStatisticsCount = await prisma.statistic.count({
    where: {
      type: StatisticType.AllTime
    }
  });

  if (globalStatisticsCount !== 1) {
    if (globalStatisticsCount === 0) {
      logger.info('Creating global statistics, because they don\'t exist');

      await prisma.statistic.create({
        data: {
          type: StatisticType.AllTime
        }
      });
    } else {
      logger.error('There are more than one all-time statistics!');
    }
  }


  await prisma.statistic.updateMany({
    where: {
      type: StatisticType.AllTime
    },
    data: command
  });
};