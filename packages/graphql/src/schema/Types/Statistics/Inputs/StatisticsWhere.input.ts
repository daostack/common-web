import { inputObjectType } from 'nexus';

export const StatisticsWhereInput = inputObjectType({
  name: 'StatisticsWhereInput',
  definition(t) {
    t.field('type', {
      type: 'StatisticType'
    });
  }
});