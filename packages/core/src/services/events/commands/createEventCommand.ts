import * as z from 'zod';
import { EventType } from '@prisma/client';

import { worker } from '@common/queues';

const schema = z.object({
  proposalId: z.string()
    .uuid()
    .optional(),

  discussionId: z.string()
    .uuid()
    .optional(),

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

export const createEventCommand = (command: z.infer<typeof schema>): void => {
  worker.addEventJob('create', command);
};