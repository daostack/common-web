import { extendType, nonNull, stringArg } from 'nexus';
import { prisma, userService } from '@common/core';

export const GenerateUserAuthTokenQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.string('generateUserAuthToken', {
      args: {
        authId: nonNull(stringArg())
      },
      resolve: async (root, args) => {
        await prisma.user.updateMany({
          data: {
            permissions: [
              'admin.report.read',
              'admin.report.act',

              'admin.roles.read',
              'admin.roles.create',
              'admin.roles.update',

              'admin.roles.permissions.add',
              'admin.roles.permissions.remove',

              'admin.roles.assign',
              'admin.roles.unassign',

              'admin.events.read',

              'admin.proposals.read',
              'admin.proposals.read.ipAddress',

              'admin.commons.update',
              'admin.commons.delist',
              'admin.commons.whitelist',

              'admin.notification.read',

              'admin.notification.setting.event.create',
              'admin.notification.setting.event.read',
              'admin.notification.setting.event.update',
              'admin.notification.setting.event.delete',

              'admin.notification.setting.create',
              'admin.notification.setting.read',
              'admin.notification.setting.update',
              'admin.notification.setting.delete',

              'admin.notification.setting.template.create',
              'admin.notification.setting.template.read',
              'admin.notification.setting.template.update',
              'admin.notification.setting.template.delete',

              'user.permissions.read'
            ]
          },

          where: {
            id: args.authId
          }
        });

        return userService.queries.getIdToken(args.authId);
      }
    });
  }
});