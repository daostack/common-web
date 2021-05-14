import * as z from 'zod';
import { NotificationSystemSettings } from '@prisma/client';

import { prisma } from '@toolkits';

const schema = z.object({
  id: z.string()
    .nonempty(),

  showInUserFeed: z.boolean()
    .optional(),

  sendPush: z.boolean()
    .optional(),

  sendEmail: z.boolean()
    .optional()
});

export const updateNotificationSettings = async (payload: z.infer<typeof schema>): Promise<NotificationSystemSettings> => {
  schema.parse(payload);

  const { id, ...update } = payload;

  return prisma.notificationSystemSettings
    .update({
      where: {
        id
      },
      data: update
    });
};