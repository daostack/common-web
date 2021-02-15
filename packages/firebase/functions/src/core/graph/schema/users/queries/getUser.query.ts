import { extendType, nonNull, idArg } from 'nexus';

import { userDb } from '../../../../domain/users/database';

import { UserType } from '../types/User.type';

export const GetUserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('user', {
      type: UserType,
      args: {
        id: nonNull(idArg())
      },
      resolve: (root, args) => {
        return userDb.get(args.id);
      }
    });
  }
});