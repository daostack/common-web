import { RoleType } from './Types/Role.type';

import { GetRolesQuery } from './Queries/GetRoles.query';

import { CreateRoleMutation } from './Mutations/CreateRole.mutation';
import { AssignRoleMutation } from './Mutations/AssignRole.mutation';

export const RoleTypes = [
  RoleType,

  GetRolesQuery,

  CreateRoleMutation,
  AssignRoleMutation
];