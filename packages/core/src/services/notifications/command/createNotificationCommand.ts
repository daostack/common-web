import * as z from 'zod';
import { NotificationType, Notification } from '@prisma/client';
import { prisma } from '@toolkits';
import { worker } from '@jobs';
import { CommonError } from '@errors';

const schema = z.object({
  userId: z.string()
    .nonempty(),

  type: z.enum(Object.keys(NotificationType) as [(keyof typeof NotificationType)]),

  connect: z.object({
    commonId: z.string()
      .nonempty()
      .optional(),

    payoutId: z.string()
      .nonempty()
      .optional(),

    proposalId: z.string()
      .nonempty()
      .optional(),

    discussionId: z.string()
      .nonempty()
      .optional()
  }).optional()
});

export const createNotificationCommand = async (payload: z.infer<typeof schema>): Promise<Notification> => {
  // Validate the payloads
  schema.parse(payload);

  // Find the notification setting to see whether the notification should be shown
  const settings = await prisma.notificationSystemSettings.findUnique({
    where: {
      type: payload.type
    },
    select: {
      showInUserFeed: true
    }
  });

  if (!settings) {
    throw new CommonError(`Cannot find settings for notification type: ${payload.type}`);
  }

  // Create the notification
  const notification = await prisma.notification.create({
    data: {
      userId: payload.userId,
      type: payload.type,

      show: settings.showInUserFeed,

      ...payload.connect
    }
  });

  // Schedule the processing
  worker.addNotificationJob('process', notification);

  // Return the created notification
  return notification;
};