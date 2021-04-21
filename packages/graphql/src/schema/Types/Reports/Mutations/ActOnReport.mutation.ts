import { mutationField, inputObjectType, nonNull, arg } from 'nexus';
import { reportService, authorizationService } from '@common/core';

export const ActOnReportInput = inputObjectType({
  name: 'ActOnReportInput',
  definition(t) {
    t.nonNull.uuid('reportId');

    t.nonNull.field('action', {
      type: 'ReportAction'
    });
  }
});

export const ActOnReportMutation = mutationField('actOnReport', {
  type: 'Report',
  args: {
    input: nonNull(
      arg({
        type: 'ActOnReportInput'
      })
    )
  },

  authorize: async (root, args, ctx) => {
    const userId = await ctx.getUserId();

    return authorizationService.reports.canActOnReport(userId, args.input.reportId);
  },

  resolve: async (root, args, ctx) => {
    const userId = await ctx.getUserId();

    return reportService.actOn({
      ...args.input,
      userId
    });
  }
});