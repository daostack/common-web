import { join } from 'path';
import { makeSchema } from 'nexus';

import { Scalars } from './scalars';

import { WireTypes } from './schema/wires';
import { UserTypes } from './schema/users';
import { EventTypes } from './schema/events';
import { PayoutTypes } from './schema/payouts';
import { CommonTypes } from './schema/commons';
import { PaymentTypes } from './schema/payments';
import { BalanceTypes } from './schema/balance';
import { ProposalTypes } from './schema/proposals';
import { IntentionTypes } from './schema/intentions';
import { SubscriptionTypes } from './schema/subscriptions';

import { StatisticsType, StatisticsTypeQueryExtension } from './schema/statistics/statistics';
import { CardTypes } from './schema/cards';


const types = [
  ...Scalars,

  ...CardTypes,
  ...UserTypes,
  ...WireTypes,
  ...EventTypes,
  ...CommonTypes,
  ...PayoutTypes,
  ...PaymentTypes,
  ...BalanceTypes,
  ...ProposalTypes,
  ...IntentionTypes,
  ...SubscriptionTypes,

  StatisticsType,
  StatisticsTypeQueryExtension
];

export const schema = makeSchema({
  types,
  outputs: {
    typegen: join(__dirname, './generated/schema.types.ts'),
    schema: join(__dirname, './generated/schema.graphql')
  },
  contextType: {
    module: join(__dirname, '..'),
    export: "IRequestContext"
  }
});
