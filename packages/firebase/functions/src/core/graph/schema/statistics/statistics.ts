import { objectType, extendType, booleanArg } from 'nexus';
import { commonDb } from '../../../../common/database';
import { proposalDb } from '../../../../proposals/database';
import { userDb } from '../../../domain/users/database';

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
    });

    t.int('commons', {
      resolve: async () => {
        // @todo This is bad, bad, bad and expensive
        return (await commonDb.getMany({})).length;
      }
    });

    t.int('joinRequests', {
      args: {
        onlyOpen: booleanArg({
          default: false
        })
      },
      resolve: async (root, args) => {
        // @todo This is bad, bad, bad and expensive
        return (await proposalDb.getMany({
          type: 'join',
          ...(args.onlyOpen ? ({
            state: 'countdown'
          }) : ({}))
        })).length;
      }
    });

    t.int('fundingRequests', {
      args: {
        onlyOpen: booleanArg({
          default: false
        })
      },
      resolve: async (root, args) => {
        // @todo This is bad, bad, bad and expensive
        return (await proposalDb.getMany({
          type: 'fundingRequest',
          ...(args.onlyOpen ? ({
            state: 'countdown'
          }) : ({}))
        })).length;
      }
    });

    t.int('users', {
      resolve: async () => {
        return (await userDb.getMany({})).length;
      }
    });
  }
});

export const StatisticsTypeQueryExtension = extendType({
  type: 'Query',
  definition(t) {
    t.field('statistics', {
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