import { objectType } from 'nexus';

export const UserType = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id', {
      description: 'The system Id of the user'
    });

    t.nonNull.date('createdAt', {
      description: 'The date, at which the item was created'
    });

    t.nonNull.date('updatedAt', {
      description: 'The date, at which the item was last modified'
    });

    t.nonNull.string('firstName', {
      description: 'The first name of the user'
    });

    t.nonNull.string('lastName', {
      description: 'The last name of the user'
    });

    t.nonNull.string('displayName', {
      description: 'The display name of the user',
      resolve: (root) => {
        return `${root.firstName[0].toUpperCase()}. ${root.lastName}`;
      }
    });

    t.model.cards();
  }
});
