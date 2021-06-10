import { mutationField, inputObjectType, nonNull, arg } from 'nexus';
import { authorizationService, commonService } from '@common/core';

const UpdateCommonInput = inputObjectType({
  name: 'UpdateCommonInput',
  definition(t) {
    t.nonNull.id('commonId');

    t.string('name');
    t.string('image');

    t.string('action');
    t.string('byline');
    t.string('description');

    t.list.nonNull.field('links', {
      type: 'CommonLinkInput'
    });

    t.list.nonNull.field('rules', {
      type: 'CommonRuleInput'
    });
  }
});

export const UpdateCommonMutation = mutationField('updateCommon', {
  type: 'Common',
  args: {
    input: nonNull(
      arg({
        type: UpdateCommonInput
      })
    )
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.common.canUpdate(args.input.commonId, await ctx.getUserId());
  },
  resolve: async (root, args) => {
    return commonService.update(args.input as any);
  }
});