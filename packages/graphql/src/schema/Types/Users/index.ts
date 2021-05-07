import { UserType } from './Types/User.type';
import { UserNotificationTokenType } from './Types/UserNotificationToken.type';

import { GetUserQuery } from './Queries/GetUser.query';

import { GenerateUserAuthTokenQuery } from './Queries/GenerateUserAuthToken.query';

import { UserNotificationTokenStateEnum } from './Enums/UserNotificationTokenState.enum';


import { UserEventsExtension } from './Extensions/UserEvents.extension';
import { UserProposalsExtension } from './Extensions/UserProposals.extension';
import { UserNotificationsExtension } from './Extensions/UserNotifications.extension';
import { UserNotificationTokensExtension } from './Extensions/UserNotificationTokens.extension';
import { UserDiscussionSubscriptionsExtension } from './Extensions/UserDiscussionSubscriptions.extension';

import {
  CreateUserNotificationTokenInput,
  CreateUserNotificationTokenMutation
} from './Mutations/CreateUserNotificationToken.mutation';
import { CreateUserInput, CreateUserMutation } from './Mutations/CreateUser.mutation';
import { VoidUserNotificationTokenMutation } from './Mutations/VoidUserNotificationToken.mutation';
import { UserWhereUniqueInput } from './Inputs/UserWhereUnique.input';
import { UserSubscriptionsExtension } from './Extensions/UserSubscriptions.extension';
import { UserWhereInput } from './Inputs/UserWhere.input';
import { GetUsersQuery } from './Queries/GetUsers.query';

export const UserTypes = [
  UserType,
  UserNotificationTokenType,

  GetUserQuery,
  GetUsersQuery,

  UserWhereUniqueInput,
  UserWhereInput,

  CreateUserInput,
  CreateUserMutation,

  CreateUserNotificationTokenInput,
  CreateUserNotificationTokenMutation,

  VoidUserNotificationTokenMutation,

  UserNotificationTokenStateEnum,

  UserEventsExtension,
  UserProposalsExtension,
  UserSubscriptionsExtension,
  UserNotificationsExtension,
  UserNotificationTokensExtension,
  UserDiscussionSubscriptionsExtension,

  GenerateUserAuthTokenQuery
];
