import * as z from 'zod';
import { NotificationTemplate, EventType } from '@prisma/client';
import { notificationsHelper } from '../helpers';
import { prisma } from '@toolkits';
import { eventService } from '@services';
import { NotFoundError } from '@errors';

const schema = z.object({
  id: z.string()
    .nonempty(),

  subject: z.string()
    .nonempty()
    .optional(),

  content: z.string()
    .nonempty()
    .optional(),

  from: z.string()
    .optional(),

  fromName: z.string()
    .optional(),

  bcc: z.string()
    .optional(),

  bccName: z.string()
    .optional()
});


export const updateNotificationTemplate = async (payload: z.infer<typeof schema>): Promise<NotificationTemplate> => {
  console.log('here');

  // Validate
  schema.parse(payload);

  // Split
  const { id, ...update } = payload;

  // Find the template before
  const template = await prisma.notificationTemplate.findUnique({
    where: {
      id
    }
  });

  if (!template) {
    throw new NotFoundError('NotificationTemplate');
  }

  // Extract stubs
  const stubs = notificationsHelper.extractStubs(
    update.content || template.content,
    update.subject || template.subject
  );

  // Create the notification template
  const updatedTemplate = await prisma.notificationTemplate.update({
    where: {
      id
    },
    data: {
      ...update,
      stubs
    }
  });

  // Event
  eventService.create({
    type: EventType.NotificationTemplateUpdated,
    payload: {
      id: updatedTemplate.id
    }
  });

  // Return
  return updatedTemplate;
};