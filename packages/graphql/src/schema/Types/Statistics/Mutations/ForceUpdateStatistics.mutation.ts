import { mutationField } from 'nexus';
import { authorizationService, statisticService } from '@common/core';

export const ForceUpdateStatisticsMutation = mutationField('forceUpdateStatistics', {
  type: 'Boolean',
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.general.write');
  },
  resolve: async () => {
    await statisticService._forceUpdateAllTime();

    return true;
  }
});