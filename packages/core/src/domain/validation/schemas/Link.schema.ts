import * as z from 'zod';

export const LinkSchema = z.object({
  title: z.string()
    .nonempty(),

  url: z.string()
    .nonempty()
    .url()
});
