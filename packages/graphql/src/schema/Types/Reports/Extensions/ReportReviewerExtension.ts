import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const ReportReviewerExtension = extendType({
  type: 'Report',
  definition(t) {
    t.id('reviewerId');

    t.field('reviewer', {
      type: 'User',
      resolve: (root) => {
        if (!root.reviewerId) {
          return null;
        }

        return prisma.user
          .findUnique({
            where: {
              id: root.reviewerId
            }
          });
      }
    });
  }
});