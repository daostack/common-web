import { IUserEntity } from '@common/types';
import { objectType } from 'nexus';

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
      resolve: (root) => {
        const userWithPermission = [
          'H5ZkcKBX5eXXNyBiPaph8EHCiax2',
          'tPfZmRJnQjdnXIlgMZyfphEat3n2',
          'KhgMwi931pMJaWri6LtcczteF693',
          '0gzqlV9O9vWWe6i2wagAZHMMDDD2',
          'Ezt5ZO19ejV2cteBocxuEkTq13l2'
        ];

        return userWithPermission.includes((root as any).id || (root as any).uid || (root as any).userId) ? [
          'admin.dashboard.read.overview',
          'admin.dashboard.read.events',

          'admin.commons.read.statistics',
          'admin.commons.read.list',

          'admin.commons.read.details',

          'admin.payouts.read.list',
          'admin.payouts.read.details',
          'admin.payouts.create',

          'admin.events.read.list',
          'admin.events.read.details',

          'admin.payments.read'
        ] : [];
      }
    });

  }
});