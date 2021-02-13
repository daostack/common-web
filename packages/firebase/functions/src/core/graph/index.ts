import { join } from 'path';
import { makeSchema } from 'nexus';

import { Scalars } from './scalars';

import { CommonTypes } from './schema/commons';
import { ProposalTypes } from './schema/proposals';

import { UserQueryExtension, UserType } from './schema/users/user';
import { StatisticsType, StatisticsTypeQueryExtension } from './schema/statistics/statistics';
import { EventType, EventTypeQueryExtensions, EventTypeEnum } from './schema/events/events';
import {
  SubscriptionMetadataType,
  SubscriptionStatusEnum,
  SubscriptionType,
  SubscriptionMetadataCommonType
} from './schema/subscriptions/subscription';


const types = [
  ...Scalars,

  ...CommonTypes,
  ...ProposalTypes,

  StatisticsType,
  StatisticsTypeQueryExtension,

  EventType,
  EventTypeEnum,
  EventTypeQueryExtensions,


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
    typegen: join(__dirname, '../generated/nexus-typegen.ts'),
    schema: join(__dirname, '../generated/adminSchema.graphql')
  }
});
