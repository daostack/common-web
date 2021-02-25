import { UserType } from './types/User.type';

import { UserProposalsExtension } from './extensions/UserProposals.extension';
import { UserSubscriptionsExtensions } from './extensions/UserSubscriptions.extension';

import { GetUserQuery } from './queries/getUser.query';
import { GetUsersQuery } from './queries/getUsers.query';

export const UserTypes = [
  UserType,

  UserProposalsExtension,
  UserSubscriptionsExtensions,

  GetUserQuery,
  GetUsersQuery
];