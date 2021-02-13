import { extendType, intArg, list } from 'nexus';
import { commonDb } from '../../../../../common/database';
import { CommonType } from '../types/Common.type';

export const GetCommonsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('commons', {
      type: list(CommonType),
      args: {
        last: intArg({
          default: 10,
        }),
        after: intArg({
          default: 0,
        }),
      },
      resolve: (root, args) => {
        return commonDb.getMany({
          last: args.last,
          after: args.after,
        });
      },
    });
  },
});