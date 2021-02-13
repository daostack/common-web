import { objectType } from 'nexus';

// @todo Fix up the imports
import { UserType } from '../../users/user';
import { userDb } from '../../../../domain/users/database';

export const CommonMemberType = objectType({
  name: 'CommonMember',
  definition(t) {
    t.nonNull.id('userId', {
      description: 'The user ID of the member'
    });

    t.date('joinedAt', {
      description: 'The date, at witch the member joined the common'
    });

    t.field('user', {
      type: UserType,
      resolve: (root) => {
        return userDb.get(root.userId);
      },
    });
  },
});
