import { UserType } from './Types/User.type';
import { UserNotificationTokenType } from './Types/UserNotificationToken.type';

import { GetUserQuery } from './Queries/GetUser.query';
import { GetUsersQuery } from './Queries/GetUsers.query';
import { GenerateUserAuthTokenQuery } from './Queries/GenerateUserAuthToken.query';

import { UserNotificationTokenStateEnum } from './Enums/UserNotificationTokenState.enum';
import { UserCountryEnum } from './Enums/UserCountry.enum';


import { UserEventsExtension } from './Extensions/UserEvents.extension';
import { UserCommonsExtension } from './Extensions/UserCommons.extension';
import { UserProposalsExtension } from './Extensions/UserProposals.extension';
import { UserNotificationsExtension } from './Extensions/UserNotifications.extension';
import { UserSubscriptionsExtension } from './Extensions/UserSubscriptions.extension';
import { UserNotificationTokensExtension } from './Extensions/UserNotificationTokens.extension';
import { UserDiscussionSubscriptionsExtension } from './Extensions/UserDiscussionSubscriptions.extension';

import { UpdateUserMutation } from './Mutations/UpdateUser.mutation';
import { CreateUserMutation } from './Mutations/CreateUser.mutation';
import { VoidUserNotificationTokenMutation } from './Mutations/VoidUserNotificationToken.mutation';
import { CreateUserNotificationTokenMutation } from './Mutations/CreateUserNotificationToken.mutation';

import { UserWhereInput } from './Inputs/UserWhere.input';
import { UserWhereUniqueInput } from './Inputs/UserWhereUnique.input';

export const UserTypes = [
  UserType,
  UserNotificationTokenType,

  GetUserQuery,
  GetUsersQuery,

  UserWhereUniqueInput,
  UserWhereInput,

  CreateUserMutation,
  VoidUserNotificationTokenMutation,
  CreateUserNotificationTokenMutation,

  UserNotificationTokenStateEnum,
  UserCountryEnum,
  UpdateUserMutation,

  UserEventsExtension,
  UserCommonsExtension,
  UserProposalsExtension,
  UserSubscriptionsExtension,
  UserNotificationsExtension,
  UserNotificationTokensExtension,
  UserDiscussionSubscriptionsExtension,

  GenerateUserAuthTokenQuery
];
