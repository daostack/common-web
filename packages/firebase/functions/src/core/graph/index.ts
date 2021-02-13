import { join } from 'path';
import { makeSchema } from 'nexus';

import { Scalars } from './scalars';

import { CommonTypes } from './schema/commons';
import { UserQueryExtension, UserType } from './schema/users/user';
import { StatisticsType, StatisticsTypeQueryExtension } from './schema/statistics/statistics';
import { EventType, EventTypeQueryExtensions, EventTypeEnum } from './schema/events/events';
import {
  SubscriptionMetadataType,
  SubscriptionStatusEnum,
  SubscriptionType, SubscriptionMetadataCommonType,
} from './schema/subscriptions/subscription';
import {
  ProposalVoteOutcomeEnum,
  ProposalVoteType,
  ProposalTypeEnum,
  ProposalStateEnum,
  ProposalPaymentStateEnum,
  ProposalFundingType,
  ProposalDescriptionType,
  ProposalsQueryExtension,
  ProposalJoinType, ProposalType,
} from './schema/proposals/proposals';


const types = [
  ...Scalars,

  ...CommonTypes,

  StatisticsType,
  StatisticsTypeQueryExtension,

  EventType,
  EventTypeEnum,
  EventTypeQueryExtensions,

  ProposalType,
  ProposalTypeEnum,
  ProposalVoteType,
  ProposalJoinType,
  ProposalStateEnum,
  ProposalFundingType,
  ProposalDescriptionType,
  ProposalVoteOutcomeEnum,
  ProposalsQueryExtension,
  ProposalPaymentStateEnum,

  UserType,
  UserQueryExtension,

  SubscriptionType,
  SubscriptionStatusEnum,
  SubscriptionMetadataType,
  SubscriptionMetadataCommonType,
];

export const schema = makeSchema({
  types,
  outputs: {
    typegen: join(__dirname, '../generated/nexus-typegen.ts'),
    schema: join(__dirname, '../generated/adminSchema.graphql'),
  },
});
