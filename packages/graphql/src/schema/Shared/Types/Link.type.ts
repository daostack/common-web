import { inputObjectType, objectType } from 'nexus';

export const LinkInputType = inputObjectType({
  name: 'LinkInput',
  definition(t) {
    t.nonNull.string('title', {
      description: 'The display title of the link'
    });

    t.nonNull.string('url', {
      description: 'The actual link part of the link'
    });
  }
});

export const LinkType = objectType({
  name: 'Link',
  definition(t) {
    t.nonNull.string('title', {
      description: 'The display title of the link'
    });

    t.nonNull.string('url', {
      description: 'The actual link part of the link'
    });
  }
});