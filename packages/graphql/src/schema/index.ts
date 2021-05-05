import path from 'path';
import { makeSchema, queryComplexityPlugin, fieldAuthorizePlugin } from 'nexus';

import { UserTypes } from './Types/Users';
import { CardTypes } from './Types/Cards';
import { VoteTypes } from './Types/Votes';
import { RoleTypes } from './Types/Roles';
import { EventTypes } from './Types/Events';
import { CommonTypes } from './Types/Common';
import { ReportTypes } from './Types/Reports';
import { ProposalTypes } from './Types/Proposals';
import { StatisticTypes } from './Types/Statistics';
import { DiscussionTypes } from './Types/Discussion';
import { CommonMemberTypes } from './Types/CommonMember';
import { NotificationTypes } from './Types/Notifications';
import { CommonSubscriptionTypes } from './Types/CommonSubscriptions';

import { UrlScalar } from './Shared/Scalars/Url.scalar';
import { VoidScalar } from './Shared/Scalars/Void.scalar';
import { DateScalar } from './Shared/Scalars/Date.scalar';
import { JsonScalar } from './Shared/Scalars/Json.scalar';
import { UuidScalar } from './Shared/Scalars/Uuid.scalar';

import { LinkType, LinkInputType } from './Shared/Types/Link.type';

import { BaseEntityInterface } from './Shared/Interfaces/BaseEntity.interface';

import { PaginateInput } from './Shared/Inputs/Paginate.input';
import { StringFilterInput } from './Shared/Inputs/StringFilter.input';
import { BillingDetailsInput } from './Shared/Inputs/BillingDetails.input';

import { SortOrder } from './Shared/Enums/SortBy.enum';

const types = [
  UserTypes,
  RoleTypes,
  CardTypes,
  VoteTypes,
  EventTypes,
  CommonTypes,
  ReportTypes,
  ProposalTypes,
  StatisticTypes,
  DiscussionTypes,
  CommonMemberTypes,
  NotificationTypes,
  CommonSubscriptionTypes,

  // Scalars
  UrlScalar,
  DateScalar,
  JsonScalar,
  UuidScalar,
  VoidScalar,

  // Shared Enums
  SortOrder,

  // Shared Types
  LinkType,

  // Shared Interfaces
  BaseEntityInterface,

  // Shared Input Types
  PaginateInput,
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
    queryComplexityPlugin(),
    fieldAuthorizePlugin()
  ]
});
