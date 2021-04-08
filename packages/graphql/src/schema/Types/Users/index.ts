import { UserType } from './Types/User.type';

import { GetUserQuery } from './Queries/GetUser.query';
import { GenerateUserAuthTokenQuery } from './Queries/GenerateUserAuthToken.query';

import { CreateUserInput, CreateUserMutation } from './Mutations/CreateUser.mutation';
import { UserEventsExtension } from './Extensions/UserEvents.extension';

export const UserTypes = [
  UserType,

  GetUserQuery,

  CreateUserInput,
  CreateUserMutation,

  UserEventsExtension,

  GenerateUserAuthTokenQuery
];