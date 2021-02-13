import { objectType } from 'nexus';

import { ProposalVoteType } from './ProposalVote.type';
import { ProposalJoinType } from './ProposalJoin.type';
import { ProposalFundingType } from './ProposalFunding.type';
import { ProposalDescriptionType } from './ProposalDescription.type';

import { ProposalTypeEnum } from '../enums/ProposalType.enum';
import { ProposalStateEnum } from '../enums/ProposalState.enum';
import { ProposalPaymentStateEnum } from '../enums/ProposalPaymentState.enum';

export const ProposalType = objectType({
  name: 'Proposal',
  description: 'The proposals type',

  definition(t) {
    t.nonNull.id('id');

    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');

    // --- Relationships

    t.nonNull.id('commonId');
    t.nonNull.id('proposerId');


    // ---  Fields
    t.nonNull.int('votesFor');
    t.nonNull.int('votesAgainst');

    t.nonNull.field('state', {
      type: ProposalStateEnum
    });

    t.nonNull.field('description', {
      type: ProposalDescriptionType
    });

    t.nonNull.field('type', {
      type: ProposalTypeEnum
    });

    t.field('paymentState', {
      type: ProposalPaymentStateEnum
    });

    t.field('fundingRequest', {
      description: 'Details about the funding request. Exists only on funding request proposals',
      type: ProposalFundingType
    });

    t.field('join', {
      description: 'Details about the join request. Exists only on join request proposals',
      type: ProposalJoinType
    });

    t.list.field('votes', {
      type: ProposalVoteType
    });
  }
});
