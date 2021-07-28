import { enumType } from 'nexus';
import { StatisticType } from '@prisma/client';

export const StatisticTypeEnum = enumType({
  name: 'StatisticType',
  members: StatisticType
});