import { extendType, inputObjectType, nonNull, arg } from 'nexus';

import { commonService } from '@services';

export const CreateCommonInput = inputObjectType({
  name: 'CreateCommonInput',
  definition(t) {
    t.nonNull.string('name');

    t.nonNull.int('fundingMinimumAmount');
    t.nonNull.date('fundingCooldown');

    t.nonNull.field('fundingType', {
      type: 'FundingType'
    });
  }
});

export const CreateCommonMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createCommon', {
      type: 'Common',
      args: {
        input: nonNull(
          arg({
            type: CreateCommonInput
          })
        )
      },

      resolve: async (root, { input }, ctx) => {
        const founderId = await ctx.getUserId();

        return commonService.create({
          ...input,
          founderId
        });
      }
    });
  }
});