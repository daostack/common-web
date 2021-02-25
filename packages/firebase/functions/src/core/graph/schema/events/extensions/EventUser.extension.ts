import { extendType } from 'nexus';
import { UserType } from '../../users/types/User.type';
import { userDb } from '../../../../domain/users/database';

export const EventUserExtension = extendType({
  type: 'Event',
  definition(t) {
    t.field('user', {
      type: UserType,
      resolve: (root) => {
        return root.userId && userDb.get(root.userId);
      }
    });
  }
});