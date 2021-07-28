import { mutationField, stringArg, nonNull } from 'nexus';
import { authorizationService, commonService } from '@common/core';

export const WhitelistCommonMutation = mutationField('whitelistCommon', {
  type: 'Boolean',
  args: {
    commonId: nonNull(stringArg())
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.commons.whitelist');
  },
  resolve: (root, args) => {
    return commonService.whitelist(args.commonId);
  }
});