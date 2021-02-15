import { objectType } from 'nexus';
import { IUserEntity } from '../../../../domain/users/types';

export const UserType = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id', {
      resolve: ((root: IUserEntity) => {
        return root.uid;
      }) as any
    });

    t.string('firstName');
    t.string('lastName');

    t.string('email');

    t.string('photoURL');

    t.date('createdAt');

    t.list.string('tokens');

    t.list.string('permissions', {
      resolve: (root, args, ctx) => {
        return [
          'admin.dashboard.read.overview',
          'admin.dashboard.read.events',

          'admin.commons.read.statistics',
          'admin.commons.read.list',

          'admin.commons.read.details',

          'admin.payouts.read.list',
          'admin.payouts.read.details',
          // 'admin.payouts.create',
        ];
      }
    })

  }
});