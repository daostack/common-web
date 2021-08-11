import { mutationField, inputObjectType, arg, nonNull } from 'nexus';
import { authorizationService, notificationService } from '@common/core';

const CreateNotificationEventSettingsInput = inputObjectType({
  name: 'CreateNotificationEventSettingsInput',
  definition(t) {
    t.nonNull.boolean('sendToEveryone');
    t.nonNull.boolean('sendToCommon');
    t.nonNull.boolean('sendToUser');

    t.nonNull.string('description');

    t.nonNull.field('sendNotificationType', {
      type: 'NotificationType'
    });

    t.nonNull.field('onEvent', {
      type: 'EventType'
    });
  }
});

export const CreateNotificationEventSettingsMutation = mutationField('createNotificationEventSettings', {
  type: 'NotificationEventSettings',
  args: {
    input: nonNull(
      arg({
        type: CreateNotificationEventSettingsInput
      })
    )
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.notification.setting.event.create');
  },
  // @ts-ignore
  resolve: (root, args) => {
    return notificationService.settings.createEventSettings(args.input as any); // FIXME
  }
});