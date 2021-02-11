import {Kind} from 'graphql';
import {scalarType} from 'nexus';

import {StatisticsType, StatisticsTypeQueryExtension} from './statistics';
import {EventTypeEnum, EventType, EventTypeQueryExtensions} from './events';
import {
  CommonMemberType,
  CommonMetadataType,
  CommonType,
  CommonTypeQueryExtension,
  CommonContributionTypeEnum,
} from './commons';
import {
  ProposalType,
  ProposalTypeEnum,
  ProposalFundingType,
  ProposalJoinType,
  ProposalStateEnum,
  ProposalPaymentStateEnum,
  ProposalDescriptionType,
  ProposalsQueryExtension,
  ProposalVoteOutcomeEnum,
  ProposalVoteType,
} from './proposals';
import { UserQueryExtension, UserType } from './user';

// Scalars

const DateScalar = scalarType({
  name: 'Date',
  asNexusMethod: 'date',
  description: 'Date custom scalar type',
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    if (typeof value.toDate === 'function') {
      value = value.toDate();
    }

    return value.getTime();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }

    return null;
  },
});


// Schema types

export const types = [
  DateScalar,

  StatisticsType,
  StatisticsTypeQueryExtension,

  EventType,
  EventTypeEnum,
  EventTypeQueryExtensions,

  CommonType,
  CommonMemberType,
  CommonMetadataType,
  CommonTypeQueryExtension,
  CommonContributionTypeEnum,

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
  UserQueryExtension
];