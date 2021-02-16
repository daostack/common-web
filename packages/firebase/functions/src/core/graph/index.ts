import { join } from 'path';
import { makeSchema } from 'nexus';

import { Scalars } from './scalars';

import { WireTypes } from './schema/wires';
import { UserTypes } from './schema/users';
import { EventTypes } from './schema/events';
import { PayoutTypes } from './schema/payouts';
import { CommonTypes } from './schema/commons';
import { ProposalTypes } from './schema/proposals';
import { SubscriptionTypes } from './schema/subscriptions';

import { StatisticsType, StatisticsTypeQueryExtension } from './schema/statistics/statistics';


const types = [
  ...Scalars,

  ...UserTypes,
  ...WireTypes,
  ...EventTypes,
  ...CommonTypes,
  ...PayoutTypes,
  ...ProposalTypes,
  ...SubscriptionTypes,

  StatisticsType,
  StatisticsTypeQueryExtension,
];

export const schema = makeSchema({
  types,
  outputs: {
    typegen: join(__dirname, './generated/schema.types.ts'),
    schema: join(__dirname, './generated/schema.graphql')
  }
});
