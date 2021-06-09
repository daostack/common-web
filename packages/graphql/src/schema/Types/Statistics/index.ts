import { StatisticTypeEnum } from './Enums/StatisticType.enum';
import { StatisticType } from './Types/Statistic.type';
import { GetStatisticsQuery } from './Queries/GetStatistics.query';
import { ForceUpdateStatisticsMutation } from './Mutations/ForceUpdateStatistics.mutation';
import { StatisticsWhereInput } from './Inputs/StatisticsWhere.input';

export const StatisticTypes = [
  StatisticTypeEnum,

  StatisticType,

  GetStatisticsQuery,
  ForceUpdateStatisticsMutation,

  StatisticsWhereInput
];