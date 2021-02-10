import {IProposalEntity, IProposalVote} from '@common/types';
import {enumType, extendType, idArg, nonNull, objectType} from 'nexus';
import {proposalDb} from '../../../proposals/database';

export const ProposalTypeEnum = enumType({
  name: 'ProposalType',
  members: {
    fundingRequest: 'fundingRequest',
    join: 'join',
  },
});

export const ProposalVoteOutcomeEnum = enumType({
  name: 'ProposalVoteOutcome',
  members: [
    'passed',
    'rejected',
  ],
});

export const ProposalStateEnum = enumType({
  name: 'ProposalState',
  members: [
    'passedInsufficientBalance',
    'countdown',
    'passed',
    'failed',
  ],
});

export const ProposalPaymentStateEnum = enumType({
  name: 'ProposalPaymentState',
  members: [
    'notAttempted',
    'notRelevant',
    'confirmed',
    'pending',
    'failed',
  ],
});

export const ProposalType = objectType({
  name: 'Proposal',
  description: 'The proposals type',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.id('proposerId');

    t.nonNull.date('createdAt', {
      resolve: (root) => {
        return typeof (root as IProposalEntity).createdAt?.toDate() === 'function'
          ? (root as IProposalEntity).createdAt.toDate()
          : (root as IProposalEntity).createdAt;
      },
    });

    t.nonNull.date('updatedAt', {
      resolve: (root) => {
        return typeof (root as IProposalEntity).updatedAt?.toDate() === 'function'
          ? (root as IProposalEntity).updatedAt.toDate()
          : (root as IProposalEntity).updatedAt;
      },
    });

    t.nonNull.int('votesFor');
    t.nonNull.int('votesAgainst');

    t.list.field('votes', {
      type: ProposalVoteType,
    });

    t.field('fundingRequest', {
      description: 'Details about the funding request. Exists only on funding request proposals',
      type: ProposalFundingType,
    });

    t.field('join', {
      description: 'Details about the join request. Exists only on join request proposals',
      type: ProposalJoinType,
    });

    t.nonNull.field('state', {
      type: ProposalStateEnum,
    });

    t.nonNull.field('description', {
      type: ProposalDescriptionType,
    });

    t.field('paymentState', {
      type: ProposalPaymentStateEnum,
    });

    t.nonNull.field('type', {
      type: ProposalTypeEnum,
    });
  },
});

export const ProposalVoteType = objectType({
  name: 'ProposalVote',
  definition(t) {
    t.nonNull.id('voteId');
    t.nonNull.id('voterId');
    t.nonNull.field('outcome', {
      type: ProposalVoteOutcomeEnum,
      resolve: ((root: IProposalVote) => root.voteOutcome) as any,
    });
  },
});

export const ProposalDescriptionType = objectType({
  name: 'ProposalDescription',
  definition(t) {
    t.string('title');
    t.nonNull.string('description');
  },
});

export const ProposalFundingType = objectType({
  name: 'ProposalFunding',
  definition(t) {
    t.nonNull.int('amount');
  },
});

export const ProposalJoinType = objectType({
  name: 'ProposalJoin',
  definition(t) {
    t.nonNull.id('cardId');
    t.nonNull.int('funding');
    t.nonNull.field('fundingType', {
      type: 'CommonContributionType',
    });
  },
});

// ----- Query extension

export const ProposalsQueryExtension = extendType({
  type: 'Query',
  definition(t) {
    t.field('proposal', {
      type: ProposalType,
      args: {
        id: nonNull(idArg()),
      },
      resolve: (root, args) => {
        return proposalDb.getProposal(args.id) as any;
      },
    });
  },
});