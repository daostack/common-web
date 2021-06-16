import * as z from 'zod';
import { StatisticType } from '@prisma/client';

import { statisticsUpdate } from '../helpers/validator';
import { updateCurrentStatistics } from './updateCurrentStatistics';

export const updateStatistics = async (update: z.infer<typeof statisticsUpdate>): Promise<void> => {
  statisticsUpdate.parse(update);

  const promises: Promise<any>[] = [
    updateCurrentStatistics(StatisticType.AllTime, update),
    updateCurrentStatistics(StatisticType.Hourly, update),
    updateCurrentStatistics(StatisticType.Daily, update),
    updateCurrentStatistics(StatisticType.Weekly, update)
  ];

  await Promise.all(promises);
};