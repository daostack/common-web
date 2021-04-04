import * as z from 'zod';

export const ProposalLinkSchema = z.object({
  title: z.string()
    .nonempty(),

  url: z.string()
    .nonempty()
    .url()
});
