import { inputObjectType, mutationField, nonNull } from 'nexus';
import { authorizationService, notificationService } from '@common/core';

const UpdateNotificationTemplateInput = inputObjectType({
  name: 'UpdateNotificationTemplateInput',
  definition(t) {
    t.nonNull.string('id');

    t.string('subject');
    t.string('content');

    t.string('fromEmail');
    t.string('fromName');

    t.string('bcc');
    t.string('bccName');
  }
});

export const UpdateNotificationTemplateMutation = mutationField('updateNotificationTemplate', {
  type: 'NotificationTemplate',
  args: {
    input: nonNull(UpdateNotificationTemplateInput)
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.notification.setting.template.update');
  },
  resolve: (root, args) => {
    return notificationService.template.update(args.input as any);
  }
});