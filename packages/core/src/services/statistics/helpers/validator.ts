import * as z from 'zod';

const intOperation = z.object({
  increment: z.number()
    .optional(),

  decrement: z.number()
    .optional()
}).optional();

export const statisticsUpdate = z.object({
  commons: intOperation,
  users: intOperation,
  joinProposals: intOperation,
  fundingProposals: intOperation,
  discussions: intOperation,
  discussionMessages: intOperation,
  payments: intOperation,
  paymentAmount: intOperation
});