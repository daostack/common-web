import { extendType, idArg, nonNull } from 'nexus';

import { whitelistCommon } from '../../../../../common/business';

export const WhitelistCommonMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.boolean('whitelistCommon', {
      args: {
        commonId: nonNull(idArg())
      },

      resolve: async (root, args) => {
        await whitelistCommon(args.commonId);

        return true;
      }
    });
  }
});