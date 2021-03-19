import { UserType } from './Types/User.type';

import { CreateUserInput, CreateUserMutation } from './Mutations/CreateUser.mutation';

import { GenerateUserAuthTokenQuery } from './Queries/GenerateUserAuthToken.query';

export const UserTypes = [
  UserType,

  CreateUserInput,
  CreateUserMutation,

  // Do not let me slip this into production
  GenerateUserAuthTokenQuery
];