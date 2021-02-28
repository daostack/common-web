import { extendType, intArg } from 'nexus';

import { UserType } from '../types/User.type';
import { userDb } from '../../../../domain/users/database';
import { CommonError } from '../../../../../util/errors';

export const GetUsersQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('users', {
      type: UserType,
      args: {
        page: intArg({
          default: 1
        }),
        perPage: intArg({
          default: 10
        })
      },
      resolve: (root, args) => {
        if (args.page < 1) {
          throw new CommonError('The page cannot be negative number!');
        }

        if(args.perPage < 1) {
          throw new CommonError('The items per page cannot be negative number!');
        }

        return userDb.getMany({
          first: args.perPage,
          after: (args.page - 1) * args.perPage
        });
      }
    });
  }
});