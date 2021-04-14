import * as z from 'zod';
import { NotificationType, Notification, NotificationSendStatus } from '@prisma/client';
import { prisma } from '@toolkits';

const schema = z.object({
  userId: z.string()
    .nonempty(),

  show: z.boolean()
    .optional(),

  sendEmail: z.boolean()
    .optional(),

  sendPush: z.boolean()
    .optional(),

  type: z.enum(Object.keys(NotificationType) as [(keyof typeof NotificationType)]),

  connect: z.object({
    commonId: z.string()
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

  // Create the notification
  const notification = await prisma.notification.create({
    data: {
      userId: payload.userId,
      type: payload.type,

      show: !!payload.show,

      emailSentStatus: payload.sendEmail
        ? NotificationSendStatus.Pending
        : NotificationSendStatus.NotRequired,

      pushSentStatus: payload.sendEmail
        ? NotificationSendStatus.Pending
        : NotificationSendStatus.NotRequired,

      ...payload.connect
    }
  });

  // @todo Notify the user


  // Return the created notification
  return notification;
};