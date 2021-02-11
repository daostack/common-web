import { objectType, extendType, nonNull, idArg } from 'nexus';
import { IUserEntity } from '../../users/types';
import { userDb } from '../../users/database';

export const UserType = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id', {
      resolve: ((root: IUserEntity) => {
        return root.uid;
      }) as any,
    });

    t.string('firstName');
    t.string('lastName');

    t.string('email');

    t.string('photoURL');

    t.date('createdAt');

    t.list.string('tokens');
  },
});

export const UserQueryExtension = extendType({
  type: 'Query',
  definition(t) {
    t.field('user', {
      type: UserType,
      args: {
        id: nonNull(idArg()),
      },
      resolve: (root, args) => {
        return userDb.get(args.id);
      },
    });
  },
});