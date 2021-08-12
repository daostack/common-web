import { mutationField, inputObjectType, nonNull } from 'nexus';
import { authorizationService, notificationService } from '@common/core';

const UpdateNotificationSettingsInput = inputObjectType({
  name: 'UpdateNotificationSettingsInput',
  definition(t) {
    t.nonNull.string('id');

    t.boolean('showInUserFeed');
    t.boolean('sendPush');
    t.boolean('sendEmail');
  }
});

export const UpdateNotificationSettingsMutation = mutationField('updateNotificationSettings', {
  type: 'NotificationSystemSettings',
  args: {
    input: nonNull(UpdateNotificationSettingsInput)
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.notification.setting.update');
  },
  // @ts-ignore
  resolve: (root, args) => {
    return notificationService.settings.update(args.input as any);
  }
});