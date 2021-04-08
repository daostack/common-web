import path from 'path';
import { makeSchema, queryComplexityPlugin } from 'nexus';

import { UserTypes } from './Types/Users';
import { CardTypes } from './Types/Cards';
import { VoteTypes } from './Types/Votes';
import { EventTypes } from './Types/Events';
import { CommonTypes } from './Types/Commons';
import { ProposalTypes } from './Types/Proposals';

import { CommonMemberTypes } from './Types/CommonMember';
import { DateScalar } from './Shared/Scalars/Date.scalar';
import { LinkType, LinkInputType } from './Shared/Types/Link.type';

import { BillingDetailsInput } from './Shared/Inputs/BillingDetails.input';
import { SortOrder } from './Shared/Enums/SortBy.enum';


const types = [
  UserTypes,
  CardTypes,
  VoteTypes,
  EventTypes,
  CommonTypes,
  ProposalTypes,
  CommonMemberTypes,

  // Scalars
  DateScalar,

  // Shared Enums
  SortOrder,

  // Shared Types
  LinkType,

  // Shared Input Types
  LinkInputType,
  BillingDetailsInput
];

export const schema = makeSchema({
  types,
  outputs: {
    typegen: path.join(__dirname, '../generated/', 'nexus-typegen.ts'),
    schema: path.join(__dirname, '../generated/', 'schema.graphql')
  },
  contextType: {
    module: path.join(__dirname, '../context'),
    export: 'IRequestContext'
  },
  plugins: [
    queryComplexityPlugin()
  ]
});