import * as z from 'zod';
import { Discussion } from '@prisma/client';
import { NotImplementedError } from '@errors';

const schema = z.object({
  commonId: z.string()
    .uuid(),

  proposalId: z.string()
    .uuid()
    .optional()
    .nullable(),

  usesId: z.string()
    .nonempty(),

  topic: z.string()
    .nonempty(),

  description: z.string()
    .nonempty()
});

export const createDiscussionCommand = (payload: z.infer<typeof schema>): Promise<Discussion> => {
  throw new NotImplementedError();
};