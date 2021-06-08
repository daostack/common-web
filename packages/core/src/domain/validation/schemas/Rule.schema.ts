import * as z from 'zod';

export const RuleSchema = z.object({
  title: z.string()
    .nonempty(),

  description: z.string()
    .optional()
});
