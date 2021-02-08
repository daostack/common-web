import { objectType, extendType } from 'nexus';

export const StatisticsType = objectType({
  name: 'Statistics',
  definition(t) {
    t.int('newCommons', {
      description: 'Commons, created on that date'
    });
  }
});

export const StatisticsTypeQueryExtension = extendType({
  type: 'Query',
  definition(t) {
    t.field('today', {
      type: StatisticsType,
      resolve: (root, args, ctx) => {
        return {
          newCommons: Math.round(Math.random() * 100)
        };
      }
    });
  }
});