import * as z from 'zod';
import { NotificationType, EventType, NotificationEventSettings } from '@prisma/client';
import { logger } from '@logger';
import { prisma } from '@toolkits';

const schema = z.object({
  sendNotificationType: z.enum(
    Object.keys(NotificationType) as [(keyof typeof NotificationType)]
  ),

  onEvent: z.enum(
    Object.keys(EventType) as [(keyof typeof EventType)]
  ),

  description: z.string()
    .min(10),

  sendToEveryone: z.boolean(),
  sendToCommon: z.boolean(),
  sendToUser: z.boolean()
});

export const createNotificationEventSettings = async (payload: z.infer<typeof schema>): Promise<NotificationEventSettings> => {
  logger.info('Creating new notification event settings');

  const settings = await prisma.notificationEventSettings.create({
    data: payload
  });

  logger.info(`Successfully created new notification settings with ID: (${settings.id})`);

  return settings;
};