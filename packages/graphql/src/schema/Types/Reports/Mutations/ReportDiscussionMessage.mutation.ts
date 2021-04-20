import { mutationField, inputObjectType, nonNull } from 'nexus';
import { reportService } from '@common/core';

export const ReportDiscussionMessageInput = inputObjectType({
  name: 'ReportDiscussionMessageInput',
  definition(t) {
    t.nonNull.uuid('messageId');
    t.nonNull.string('note');

    t.nonNull.field('for', {
      type: 'ReportFor'
    });
  }
});

export const ReportDiscussionMessageMutation = mutationField('reportDiscussionMessage', {
  type: nonNull('Report'),
  args: {
    input: nonNull('ReportDiscussionMessageInput')
  },
  resolve: async (root, args, ctx) => {
    const userId = await ctx.getUserId();

    return reportService.create({
      ...args.input,
      reporterId: userId
    });
  }
});