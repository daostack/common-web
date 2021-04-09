import path from 'path';
import { makeSchema, queryComplexityPlugin } from 'nexus';

import { UserTypes } from './Types/Users';
import { CardTypes } from './Types/Cards';
import { VoteTypes } from './Types/Votes';
import { EventTypes } from './Types/Events';
import { CommonTypes } from './Types/Commons';
import { ProposalTypes } from './Types/Proposals';

import { CommonMemberTypes } from './Types/CommonMember';

import { UrlScalar } from './Shared/Scalars/Url.scalar';
import { DateScalar } from './Shared/Scalars/Date.scalar';
import { JsonScalar } from './Shared/Scalars/Json.scalar';

import { LinkType, LinkInputType } from './Shared/Types/Link.type';

import { BillingDetailsInput } from './Shared/Inputs/BillingDetails.input';
import { StringFilterInput } from './Shared/Inputs/StringFilter.input';

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
  UrlScalar,
  DateScalar,
  JsonScalar,

  // Shared Enums
  SortOrder,

  // Shared Types
  LinkType,

  // Shared Input Types
  LinkInputType,
  StringFilterInput,
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