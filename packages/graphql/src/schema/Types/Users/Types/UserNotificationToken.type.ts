import { objectType } from 'nexus';

export const UserNotificationTokenType = objectType({
  name: 'UserNotificationToken',
  definition(t) {
    t.implements('BaseEntity');

    t.nonNull.field('state', {
      type: 'UserNotificationTokenState'
    });

    t.nonNull.string('token', {
      resolve: (root) => {
        const { token } = (root as any);

        return token.substring(1, 4) + '********' + token.substr(token.length - 5);
      }
    });

    t.nonNull.string('description');

    t.nonNull.date('lastUsed');
    t.nonNull.date('lastVerified');
  }
});