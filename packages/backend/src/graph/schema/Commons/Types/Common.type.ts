import { objectType } from 'nexus';

export const CommonType = objectType({
  name: 'Common',
  definition(t) {
    t.nonNull.id('id', {
      description: 'The main identifier of the common'
    });

    t.nonNull.date('createdAt', {
      description: 'The date, at which the item was created'
    });

    t.nonNull.date('updatedAt', {
      description: 'The date, at which the item was last modified'
    });

    t.nonNull.string('name', {
      description: 'The name of the common as provided'
    });

    t.nonNull.boolean('whitelisted', {
      description: 'The whitelisting state of a common'
    });
  }
});