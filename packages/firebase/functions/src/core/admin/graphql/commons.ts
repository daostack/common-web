import { objectType, extendType, idArg, nonNull, enumType, list, intArg } from 'nexus';
import { ICommonEntity, ICommonMetadata } from '@common/types';
import { commonDb } from '../../../common/database';
import { convertTimestampToDate } from '../../../util';
import { ProposalType } from './proposals';
import { proposalDb } from '../../../proposals/database';
import { userDb } from '../../users/database';
import { UserType } from './user';

export const CommonContributionTypeEnum = enumType({
  name: 'CommonContributionType',
  members: {
    oneTime: 'one-time',
    monthly: 'monthly',
  },
});

export const CommonType = objectType({
  name: 'Common',
  description: 'The common type',
  definition(t) {
    t.nonNull.id('id', {
      description: 'The unique identifier of the common',
    });

    t.nonNull.date('createdAt', {
      description: 'The date, at which the common was created',
    });

    t.nonNull.date('updatedAt', {
      description: 'The date, at which the common was last updated',
    });

    t.nonNull.string('name', {
      description: 'The display name of the common',
    });

    t.nonNull.int('balance', {
      description: 'The currently available funds of the common',
      resolve: (root: ICommonEntity) => Math.round(root.balance),
    });

    t.nonNull.int('raised', {
      description: 'The total amount of money, raised by the common',
      resolve: (root: ICommonEntity) => Math.round(root.raised),
    });

    t.nonNull.field('metadata', {
      type: CommonMetadataType,
    });

    t.nonNull.int('openJoinRequests', {
      resolve: async (root) => {
        const openJoinRequest = await proposalDb.getMany({
          type: 'join',
          state: [
            'countdown',
          ],
        });

        return openJoinRequest.length;
      },
    });


    t.nonNull.int('openFundingRequests', {
      resolve: async (root) => {
        const openJoinRequest = await proposalDb.getMany({
          type: 'fundingRequest',
          state: [
            'countdown',
          ],
        });

        return openJoinRequest.length;
      },
    });


    t.list.field('proposals', {
      type: ProposalType,
      args: {
        page: intArg({
          default: 1,
        }),
      },
      resolve: async (root, args) => {
        const proposals = await proposalDb.getMany({
          commonId: root.id,

          last: 10,
          after: (args.page - 1) * 10,
        });

        return proposals.map(convertTimestampToDate) as any;
      },
    });

    t.list.field('members', {
      type: CommonMemberType,
      resolve: (root: ICommonEntity) => {
        return root.members.map((member) => ({
          userId: member.userId,
          joinedAt: member.joinedAt?.toDate(),
        }));
      },
    });
  },
});

export const CommonMemberType = objectType({
  name: 'CommonMember',
  definition(t) {
    t.nonNull.id('userId');
    t.date('joinedAt');

    t.field('user', {
      type: UserType,
      resolve: (root) => {
        return userDb.get(root.userId)
      }
    })
  },
});

export const CommonMetadataType = objectType({
  name: 'CommonMetadata',
  definition(t) {
    t.nonNull.string('byline');
    t.nonNull.string('description');
    t.nonNull.string('founderId');
    t.nonNull.int('minFeeToJoin');

    t.nonNull.field('contributionType', {
      type: CommonContributionTypeEnum,
      resolve: (root: ICommonMetadata) => {
        return root.contributionType;
      },
    });
  },
});

// ----- Query extension

export const CommonTypeQueryExtension = extendType({
  type: 'Query',
  definition(t) {
    t.field('common', {
      type: CommonType,
      args: {
        commonId: nonNull(idArg()),
      },
      resolve: async (root, args) => {
        return convertTimestampToDate(
          await commonDb.get(args.commonId),
        );
      },
    });

    t.field('commons', {
      type: list(CommonType),
      args: {
        last: intArg({
          default: 10,
        }),
        after: intArg({
          default: 0,
        }),
      },
      resolve: async (root, args) => {
        const commons = await commonDb.getMany({
          last: args.last,
          after: args.after,
        });

        return commons.map(convertTimestampToDate);
      },
    });
  },
});