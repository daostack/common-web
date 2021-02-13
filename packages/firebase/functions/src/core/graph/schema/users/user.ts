import { objectType, extendType, nonNull, idArg, intArg, arg } from 'nexus';
import { IUserEntity } from '../../../domain/users/types';
import { userDb } from '../../../domain/users/database';
import { SubscriptionType, SubscriptionStatusEnum } from '../subscriptions/subscription';
import { subscriptionDb } from '../../../../subscriptions/database';
import { ProposalType } from '../proposals/proposals';
import { CommonError } from '../../../../util/errors';
import { proposalDb } from '../../../../proposals/database';

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

    t.list.field('subscriptions', {
      type: SubscriptionType,
      args: {
        page: intArg({
          default: 1,
        }),

        status: arg({
          type: SubscriptionStatusEnum,
        }),
      },
      resolve: async (root: any, args) => {
        return subscriptionDb.getMany({
          userId: root.id || root.uid,
        });
      },
    });

    t.list.field('proposals', {
      type: ProposalType,
      args: {
        page: intArg({
          default: 1,
        }),
      },
      resolve: (root: any, args) => {
        if (args.page < 1) {
          throw new CommonError('Request at least the first page');
        }

        return proposalDb.getMany({
          proposerId: root.id || root.uid,
          last: 10,
          after: (args.page - 1) * 10,
        }) as any;
      },
    });
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