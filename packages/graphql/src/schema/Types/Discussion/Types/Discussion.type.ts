import { objectType } from 'nexus';

export const DiscussionType = objectType({
  name: 'Discussion',
  definition(t) {
    t.implements('BaseEntity');
  }
});