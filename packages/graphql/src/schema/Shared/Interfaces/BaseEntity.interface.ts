import { interfaceType } from 'nexus';

export const BaseEntityInterface = interfaceType({
  resolveType: () => null,
  name: 'BaseEntity',
  definition(t) {
    t.nonNull.uuid('id', {
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