import * as z from 'zod';
import { EventType } from '@prisma/client';

import { worker } from '@common/worker';

const schema = z.object({
  commonId: z.string()
    .uuid()
    .optional(),

  userId: z.string()
    .uuid()
    .optional(),

  type: z.enum(Object.keys(EventType) as [(keyof typeof EventType)]),

  payload: z.string()
    .optional()
    .nullable()
});

export const createEventCommand = async (command: z.infer<typeof schema>): Promise<void> => {
  worker.addEventJob('create', command);
};