import * as z from 'zod';
import { Country, NotificationLanguage, EventType, User } from '@prisma/client';

import { prisma } from '@toolkits';
import { eventService } from '@services';

const schema = z.object({
  id: z.string()
    .nonempty(),

  firstName: z.string()
    .optional(),

  lastName: z.string()
    .optional(),

  photo: z.string()
    .optional(),

  country: z.enum(Object.keys(Country) as [(keyof typeof Country)])
    .optional(),

  notificationLanguage: z.enum(Object.keys(NotificationLanguage) as [(keyof typeof NotificationLanguage)])
    .optional(),

  intro: z.string()
    .optional()
});

export const updateUserCommand: (command: z.infer<typeof schema>) => Promise<User> = async (command) => {
  // Basic validation on the payload
  await schema.parseAsync(command);

  // Separate the where clause from the update clause
  const { id, ...updatePayload } = command;

  // Create the user
  const user = await prisma.user.update({
    where: {
      id
    },

    data: updatePayload
  });

  // Create event about the update of the user
  eventService.create({
    type: EventType.UserUpdated,
    userId: user.id
  });

  // Finally return the updated user
  return user;
};