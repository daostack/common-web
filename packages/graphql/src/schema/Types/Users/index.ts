import { UserType } from './Types/User.type';

import { GetUserQuery } from './Queries/GetUser.query';
import { GenerateUserAuthTokenQuery } from './Queries/GenerateUserAuthToken.query';

import { CreateUserInput, CreateUserMutation } from './Mutations/CreateUser.mutation';

import { UserEventsExtension } from './Extensions/UserEvents.extension';
import { UserProposalsExtension } from './Extensions/UserProposals.extension';
import { UserDiscussionSubscriptionsExtension } from './Extensions/UserDiscussionSubscriptions.extension';

export const UserTypes = [
  UserType,

  GetUserQuery,

  CreateUserInput,
  CreateUserMutation,

  UserEventsExtension,
  UserProposalsExtension,
  UserDiscussionSubscriptionsExtension,

  GenerateUserAuthTokenQuery
];