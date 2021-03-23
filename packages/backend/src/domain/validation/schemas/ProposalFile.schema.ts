import * as z from 'zod';

export const ProposalFileSchema = z.object({
  value: z.string()
    .nonempty()
});