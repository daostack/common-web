import { mutationField, nonNull } from 'nexus';
import { authorizationService, notificationService } from '@common/core';

export const DeleteEventNotificationSettingMutation = mutationField('deleteEventNotificationSetting', {
  type: 'Boolean',
  args: {
    id: nonNull('ID')
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.notification.setting.event.delete');
  },
  resolve: async (root, args) => {
    return notificationService.settings.deleteEventSettings(args.id);
  }
});