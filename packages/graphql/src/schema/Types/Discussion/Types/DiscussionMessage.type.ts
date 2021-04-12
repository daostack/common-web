import { objectType } from 'nexus';

export const DiscussionMessageType = objectType({
  name: 'DiscussionMessage',
  definition(t) {
    t.implements('BaseEntity');

    t.nonNull.string('message');

    t.nonNull.field('type', {
      type: 'DiscussionMessageType'
    });
  }
});