import { join } from 'path';
import { makeSchema } from 'nexus';

import { Scalars } from './scalars';

import { EventTypes } from './schema/events';
import { CommonTypes } from './schema/commons';
import { ProposalTypes } from './schema/proposals';

import { UserQueryExtension, UserType } from './schema/users/user';
import { StatisticsType, StatisticsTypeQueryExtension } from './schema/statistics/statistics';
import {
  SubscriptionMetadataType,
  SubscriptionStatusEnum,
  SubscriptionType,
  SubscriptionMetadataCommonType
} from './schema/subscriptions/subscription';


const types = [
  ...Scalars,

  ...EventTypes,
  ...CommonTypes,
  ...ProposalTypes,

  StatisticsType,
  StatisticsTypeQueryExtension,

  UserType,
  UserQueryExtension,

  SubscriptionType,
  SubscriptionStatusEnum,
  SubscriptionMetadataType,
  SubscriptionMetadataCommonType
];

export const schema = makeSchema({
  types,
  outputs: {
    typegen: join(__dirname, './generated/schema.types.ts'),
    schema: join(__dirname, './generated/schema.graphql')
  }
});
