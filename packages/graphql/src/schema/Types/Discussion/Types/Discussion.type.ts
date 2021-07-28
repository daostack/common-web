import { objectType } from 'nexus';
import { prisma } from '@common/core';

export const DiscussionType = objectType({
  name: 'Discussion',
  definition(t) {
    t.implements('BaseEntity');

    t.nonNull.string('topic', {
      description: 'What this discussion is about'
    });

    t.nonNull.string('description', {
      description: 'Short description of the topic'
    });

    t.nonNull.date('latestMessage', {
      description: 'The date at which the last message on the discussion was added'
    });

    t.nonNull.field('type', {
      type: 'DiscussionType'
    });

    t.nonNull.string('userId');

    t.nonNull.field('owner', {
      type: 'User'
    });

    t.nonNull.string('commonId', {
      description: 'The parent common of the discussion'
    });

    t.nonNull.int('messageCount', {
      complexity: 20,
      resolve: (root) => {
        return prisma.discussionMessage
          .count({
            where: {
              discussionId: root.id
            }
          });
      }
    });
  }
});