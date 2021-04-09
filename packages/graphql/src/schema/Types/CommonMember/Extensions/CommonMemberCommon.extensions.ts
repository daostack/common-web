import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const CommonMemberCommonExtensions = extendType({
  type: 'CommonMember',
  definition(t) {
    t.field('common', {
      type: 'Common',
      complexity: 10,
      resolve: (root) => {
        return prisma.common.findUnique({
          where: {
            id: root.commonId
          }
        });
      }
    });
  }
});