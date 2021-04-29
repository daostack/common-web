import { extendType, inputObjectType, nonNull, arg } from 'nexus';

import { commonService } from '@common/core';

export const CreateCommonInput = inputObjectType({
  name: 'CreateCommonInput',
  definition(t) {
    t.nonNull.string('name');

    t.nonNull.int('fundingMinimumAmount');

    t.nonNull.field('fundingType', {
      type: 'FundingType'
    });

    t.nonNull.string('image');
    t.nonNull.string('description');
    t.string('action');
    t.string('byline');
    t.string('description');
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