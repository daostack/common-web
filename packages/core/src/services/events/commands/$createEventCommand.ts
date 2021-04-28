import * as z from 'zod';

import { Event, EventType } from '@prisma/client';
import { prisma } from '@toolkits';

const schema = z.object({
  type: z.enum(Object.keys(EventType) as [(keyof typeof EventType)]),

  userId: z.string()
    .optional()
    .nullable(),

  commonId: z.string()
    .optional()
    .nullable(),

  proposalId: z.string()
    .uuid()
    .optional(),

  discussionId: z.string()
    .uuid()
    .optional(),

  payload: z.any()
    .optional()
    .nullable()
});

/**
 * Creates new event into the database. If you are not sure if
 * you should use that function maybe you need to use
 * `createEventCommand`.
 *
 * @param payload - The payload to create the event
 */
export const $createEventCommand = (payload: z.infer<typeof schema>): Promise<Event> => {
  return prisma.event.create({
    data: payload
  });
};