import { extendType } from 'nexus';

import { userDb } from '../../../../domain/users/database';

import { UserType } from '../../users/types/User.type';

export const CommonMemberUserExtension = extendType({
  type: 'CommonMember',
  definition(t) {
    t.field('user', {
      type: UserType,
      resolve: (root) => {
        return userDb.get(root.userId);
      }
    });
  }
});