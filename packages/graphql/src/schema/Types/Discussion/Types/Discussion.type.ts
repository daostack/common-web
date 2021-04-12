import { objectType } from 'nexus';

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

    t.nonNull.date('lastMessage', {
      description: 'The date at which the last message on the discussion was added'
    });

    t.nonNull.field('type', {
      type: 'DiscussionType'
    });
  }
});