import { objectType } from 'nexus';

export const UserType = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id', {
      description: 'The system Id of the user'
    });

    // @todo Allow this to be seen only by the user, and system admin
    t.nonNull.id('authId', {
      description: 'The ID of the user, as is in the authentication system'
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
  }
});
