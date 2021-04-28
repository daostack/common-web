import * as z from 'zod';
import { StatisticType } from '@prisma/client';

import { prisma } from '@toolkits';

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


  await prisma.statistic.updateMany({
    where: {
      type: StatisticType.AllTime
    },
    data: command
  });
};