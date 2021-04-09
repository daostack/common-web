import * as z from 'zod';
import { EventType } from '@prisma/client';

import { worker } from '@common/queues';

const schema = z.object({
  commonId: z.string()
    .uuid()
    .optional(),

  userId: z.string()
    .uuid()
    .optional(),

  type: z.enum(Object.keys(EventType) as [(keyof typeof EventType)]),

  payload: z.union([
    z.string(),
    z.any()
  ])
});

export const createEventCommand = async (command: z.infer<typeof schema>): Promise<void> => {
  worker.addEventJob('create', command);
};