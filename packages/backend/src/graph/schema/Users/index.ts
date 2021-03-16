import { CreateUserInput, CreateUserMutation } from './Mutations/CreateUser.mutation';
import { GenerateUserAuthTokenQuery } from './Queries/GenerateUserAuthToken.query';

export const UserTypes = [
  CreateUserInput,
  CreateUserMutation,

  // Do not let me slip this into production
  GenerateUserAuthTokenQuery
];