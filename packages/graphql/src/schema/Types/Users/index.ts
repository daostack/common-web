import { UserType } from './Types/User.type';

import { GetUserQuery } from './Queries/GetUser.query';
import { GenerateUserAuthTokenQuery } from './Queries/GenerateUserAuthToken.query';

import { CreateUserInput, CreateUserMutation } from './Mutations/CreateUser.mutation';

export const UserTypes = [
  UserType,

  GetUserQuery,

  CreateUserInput,
  CreateUserMutation,

  // Do not let me slip this into production
  GenerateUserAuthTokenQuery
];