import {
  EventType,
  NotificationTemplate,
  NotificationType,
  NotificationLanguage,
  NotificationTemplateType
} from '@prisma/client';
import * as z from 'zod';


import { prisma } from '@toolkits';
import { eventService } from '@services';
import { notificationsHelper } from '../helpers';

const schema = z.object({
  forType: z.enum(Object.keys(NotificationType) as [(keyof typeof NotificationType)]),
  language: z.enum(Object.keys(NotificationLanguage) as [(keyof typeof NotificationLanguage)]),
  templateType: z.enum(Object.keys(NotificationTemplateType) as [(keyof typeof NotificationTemplateType)]),

  subject: z.string()
    .nonempty(),

  content: z.string()
    .nonempty(),

  from: z.string()
    .optional(),

  fromName: z.string()
    .optional(),

  bcc: z.string()
    .optional(),

  bccName: z.string()
    .optional()
});

export const createNotificationTemplateCommand = async (payload: z.infer<typeof schema>): Promise<NotificationTemplate> => {
  // Validate
  schema.parse(payload);

  // Extract stubs
  const stubs = notificationsHelper.extractStubs(
    payload.content,
    payload.subject
  );

  // @todo Validate stubs

  // Create the notification template
  const template = await prisma.notificationTemplate.create({
    data: {
      ...payload,
      stubs
    }
  });

  // Event
  eventService.create({
    type: EventType.NotificationTemplateCreated,
    payload: {
      id: template.id,
      templateFor: template.forType,
      templateType: template.templateType,
      templateLanguage: template.language
    }
  });

  // Return
  return template;
};