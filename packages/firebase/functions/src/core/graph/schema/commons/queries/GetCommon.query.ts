import { extendType, idArg, nonNull } from "nexus";
import { commonDb } from '../../../../../common/database';
import { CommonType } from '../types/Common.type';

export const GetCommonQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('common', {
      type: CommonType,
      args: {
        commonId: nonNull(
          idArg({
            description: 'The ID of the common, that you want to retrieve'
          })
        ),
      },
      resolve: (root, args) => {
        return commonDb.get(args.commonId);
      },
    });
  }
})