import * as z from 'zod';

import { Payment } from '@prisma/client';
import { prisma } from '@toolkits';
import { NotFoundError, NotImplementedError } from '@errors';

const schema = z.object({
  proposalId: z.string()
    .uuid()
    .nonempty()
});

export const createPayment = async (command: z.infer<typeof schema>): Promise<Payment> => {
  // Find the proposal (and subscription)
  const proposal = await prisma.proposal.findUnique({
    where: {
      id: command.proposalId
    },
    select: {
      state: true,

      join: {
        select: {
          paymentState: true,
          funding: true,

          subscription: {
            select: {
              id: true
            }
          }
        }
      }
    }
  });

  // This is not user callable so it should never fail, but check if the proposal exists
  if (!proposal) {
    throw new NotFoundError('proposal', command.proposalId);
  }

  throw new NotImplementedError('The payment creation is work in progress');

  // Create the payment with Circle
  // Create scheduled task for payment details update
  // Create event
  // Return the created payment
};