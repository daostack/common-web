import { extendType } from 'nexus';

import { prisma } from '@common/core';

export const ReportReporterExtension = extendType({
  type: 'Report',
  definition(t) {
    t.nonNull.id('reporterId');

    t.nonNull.field('reporter', {
      type: 'User',
      resolve: async (root) => {
        return (await prisma.report
          .findUnique({
            where: {
              id: 'root.id'
            }
          })
          .reporter())!;
      }
    });
  }
});