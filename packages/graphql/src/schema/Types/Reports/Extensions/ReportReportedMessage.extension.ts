import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const ReportReportedMessageExtension = extendType({
  type: 'Report',
  definition(t) {
    t.uuid('messageId');

    t.field('message', {
      type: 'DiscussionMessage',
      resolve: async (root) => {
        return (await prisma.report
          .findUnique({
            where: {
              id: root.id
            }
          })
          .message())!;
      }
    });
  }
});