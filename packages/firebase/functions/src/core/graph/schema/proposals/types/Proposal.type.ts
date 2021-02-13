import { objectType } from 'nexus';

import { CommonType } from '../../commons/types/Common.type';
import { commonDb } from '../../../../../common/database';
import { UserType } from '../../users/user';
import { userDb } from '../../../../domain/users/database';
import {
  ProposalVoteType,
  ProposalFundingType,
  ProposalJoinType,
  ProposalStateEnum,
  ProposalDescriptionType, ProposalPaymentStateEnum, ProposalTypeEnum
} from '../index';
import { GraphTypes } from '../../../constants/TypeNames';

export const ProposalType = objectType({
  name: GraphTypes.Proposal,
  description: 'The proposals type',

  definition(t) {
    t.nonNull.id('id');
    t.nonNull.id('proposerId');

    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');

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

    t.nonNull.string('commonId');

    t.nonNull.field('common', {
      type: CommonType,
      resolve: (root) => {
        return commonDb.get((root as any).commonId);
      },
    });

    t.nonNull.field('proposer', {
      type: UserType,
      resolve: (root) => {
        return userDb.get(root.proposerId);
      },
    });
  },
});
