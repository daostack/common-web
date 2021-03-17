import * as z from 'zod';
import { Event, EventType } from '@prisma/client';
import { prisma } from '@toolkits';

const schema = z.object({
  commonId: z.string()
    .uuid()
    .optional(),

  userId: z.string()
    .uuid()
    .optional(),

  type: z.enum(Object.keys(EventType) as [(keyof typeof EventType)])
});

export const createEventCommand = (command: z.infer<typeof schema>): Promise<Event> => {
  return prisma.event.create({
    data: {
      type: command.type,
      userId: command.userId,
      commonId: command.commonId,
    }
  })
}