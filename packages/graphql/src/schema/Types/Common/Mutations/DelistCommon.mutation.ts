import { mutationField, stringArg, nonNull } from 'nexus';
import { authorizationService, commonService } from '@common/core';

export const DelistCommonMutation = mutationField('delistCommon', {
  type: 'Boolean',
  args: {
    commonId: nonNull(stringArg())
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.commons.delist');
  },
  resolve: (root, args) => {
    return commonService.delist(args.commonId);
  }
});