import { join } from 'path';
import { makeSchema } from 'nexus';

import { Scalars } from './scalars';

import { EventTypes } from './schema/events';
import { CommonTypes } from './schema/commons';
import { ProposalTypes } from './schema/proposals';
import { SubscriptionTypes } from './schema/subscriptions';

import { UserQueryExtension, UserType } from './schema/users/user';
import { StatisticsType, StatisticsTypeQueryExtension } from './schema/statistics/statistics';


const types = [
  ...Scalars,

  ...EventTypes,
  ...CommonTypes,
  ...ProposalTypes,
  ...SubscriptionTypes,

  StatisticsType,
  StatisticsTypeQueryExtension,

  UserType,
  UserQueryExtension

];

export const schema = makeSchema({
  types,
  outputs: {
    typegen: join(__dirname, './generated/schema.types.ts'),
    schema: join(__dirname, './generated/schema.graphql')
  }
});
