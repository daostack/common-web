import { objectType, extendType } from 'nexus';

export const StatisticsType = objectType({
  name: 'Statistics',
  definition(t) {
    t.int('newCommons', {
      description: 'Commons, created on that date'
    });

    t.int('newJoinRequests', {
      description: 'The amount of proposals with join type, created on that date'
    });

    t.int('newFundingRequests', {
      description: 'The amount of proposals with funding type, created on that date'
    });

    t.int('newDiscussions', {
      description: 'The amount of discussions, started on that date'
    });

    t.int('newDiscussionMessages', {
      description: 'The amount of new discussion messages, send on that date'
    })
  }
});

export const StatisticsTypeQueryExtension = extendType({
  type: 'Query',
  definition(t) {
    t.field('today', {
      type: StatisticsType,
      resolve: () => {
        return {
          newCommons: Math.round(Math.random() * 100),
          newJoinRequest: Math.round(Math.random() * 100),
          newFundingRequests: Math.round(Math.random() * 100),
          newDiscussions: Math.round(Math.random() * 100),
          newDiscussionMessages: Math.round(Math.random() * 1000)
        };
      }
    });
  }
});