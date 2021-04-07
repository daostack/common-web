import * as z from 'zod';

import { Event, EventType } from '@prisma/client';
import { prisma } from '../../../domain/toolkits/index';

const schema = z.object({
  type: z.enum(Object.keys(EventType) as [(keyof typeof EventType)]),

  userId: z.string()
    .optional()
    .nullable(),

  commonId: z.string()
    .optional()
    .nullable(),

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
export const $createEventCommand = async (payload: z.infer<typeof schema>): Promise<Event> => {
  return prisma.event.create({
    data: payload
  });
};