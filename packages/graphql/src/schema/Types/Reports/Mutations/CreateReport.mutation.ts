import { mutationField, inputObjectType, nonNull } from 'nexus';
import { ReportType } from '@prisma/client';

import { reportService, CommonError } from '@common/core';

export const CreateReportInput = inputObjectType({
  name: 'CreateReportInput',
  definition(t) {
    t.uuid('messageId');
    t.uuid('proposalId');

    t.nonNull.string('note');

    t.nonNull.field('type', {
      type: 'ReportType'
    });

    t.nonNull.field('for', {
      type: 'ReportFor'
    });
  }
});

export const CreateReportMutation = mutationField('createReport', {
  type: nonNull('Report'),
  args: {
    input: nonNull(CreateReportInput)
  },
  resolve: async (root, args, ctx) => {
    const userId = await ctx.getUserId();

    if (args.input.type === ReportType.MessageReport) {
      if (!args.input.messageId) {
        throw new CommonError('Cannot create message report without message ID!');
      }

      if (args.input.proposalId) {
        throw new CommonError('Cannot create message report when there is proposal ID present!');
      }
    }

    if (args.input.type === ReportType.ProposalReport) {
      if (!args.input.proposalId) {
        throw new CommonError('Cannot create proposal report without proposal ID!');
      }

      if (args.input.messageId) {
        throw new CommonError('Cannot create proposal report when there is message ID present!');
      }
    }

    return reportService.create({
      ...args.input,
      reporterId: userId
    });
  }
});