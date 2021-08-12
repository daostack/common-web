import { mutationField, inputObjectType, arg, nonNull } from 'nexus';
import { authorizationService, notificationService } from '@common/core';

const CreateNotificationTemplateInput = inputObjectType({
  name: 'CreateNotificationTemplateInput',
  definition(t) {
    t.nonNull.field('forType', {
      type: 'NotificationType'
    });

    t.nonNull.field('language', {
      type: 'NotificationLanguage'
    });

    t.nonNull.field('templateType', {
      type: 'NotificationTemplateType'
    });

    t.nonNull.string('subject');
    t.nonNull.string('content');

    t.string('fromEmail');
    t.string('fromName');
  }
});

export const CreateNotificationTemplateMutation = mutationField('createNotificationTemplate', {
  type: 'NotificationTemplate',
  args: {
    input: nonNull(
      arg({
        type: CreateNotificationTemplateInput
      })
    )
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.notification.setting.template.create');
  },
  // @ts-ignore
  resolve: (root, args) => {
    return notificationService.template.create(args.input as any);
  }
});