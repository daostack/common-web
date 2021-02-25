import { extendType } from 'nexus';

import { UserType } from '../../users/types/User.type';
import { userDb } from '../../../../domain/users/database';

export const PaymentUserExtension = extendType({
  type: 'Payment',
  definition(t) {
    t.field('user', {
      type: UserType,
      resolve: (root) => {
        return userDb.get(root.userId);
      }
    });
  }
});