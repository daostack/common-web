import { interfaceType } from 'nexus';

export const BaseEntity = interfaceType({
  name: 'BaseEntity',
  resolveType(data) {
  },
  definition(t) {
    t.nonNull.id('id', {
      description: 'The main identifier of the item'
    });

    t.nonNull.date('createdAt', {
      description: 'The date, at which the item was created'
    });

    t.nonNull.date('updatedAt', {
      description: 'The date, at which the item was last modified'
    });
  }
});
