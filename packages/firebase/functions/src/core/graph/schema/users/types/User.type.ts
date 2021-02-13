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

  }
});