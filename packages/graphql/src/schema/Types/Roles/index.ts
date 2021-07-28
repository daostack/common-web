import { RoleType } from './Types/Role.type';

import { RoleUsersExtension } from './Extensions/RoleUsers.extension';

import { GetRoleQuery } from './Queries/GetRole.query';
import { GetRolesQuery } from './Queries/GetRoles.query';

import { RoleWhereUniqueInput } from './Inputs/RoleWhereUnique.input';

import { CreateRoleMutation } from './Mutations/CreateRole.mutation';
import { AssignRoleMutation } from './Mutations/AssignRole.mutation';
import { UnassignRoleMutation } from './Mutations/UnassignRole.mutation';

export const RoleTypes = [
  RoleType,

  RoleUsersExtension,

  GetRoleQuery,
  GetRolesQuery,

  RoleWhereUniqueInput,

  CreateRoleMutation,
  AssignRoleMutation,
  UnassignRoleMutation
];