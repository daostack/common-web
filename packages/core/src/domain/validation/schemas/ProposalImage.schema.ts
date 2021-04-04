import * as z from 'zod';

export const ProposalImageSchema = z.object({
  value: z.string()
    .nonempty()
});