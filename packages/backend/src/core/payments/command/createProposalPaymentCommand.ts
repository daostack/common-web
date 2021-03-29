import { Payment, PaymentType, ProposalPaymentState } from '@prisma/client';

import { prisma } from '@toolkits';
import { NotFoundError, CommonError } from '@errors';

import { createPaymentCommand } from './createPaymentCommand';

/**
 * Create payment for one time proposal
 *
 * @param proposalId
 */
export const createProposalPaymentCommand = async (proposalId: string): Promise<Payment> => {
  // Find the proposal
  const proposal = await prisma.proposal.findUnique({
    where: {
      id: proposalId
    },
    select: {
      id: true,
      commonId: true,

      ipAddress: true,

      join: {
        select: {
          id: true,
          funding: true,

          card: {
            select: {
              id: true,
              circleCardId: true
            }
          }
        }
      },

      user: {
        select: {
          id: true,
          email: true
        }
      }
    }
  });

  if (!proposal) {
    throw new NotFoundError('proposal', proposalId);
  }

  if (!proposal.join) {
    throw new CommonError('Cannot create payment for not join proposals');
  }

  // Create the payment
  const payment = createPaymentCommand({
    connect: {
      proposalId: proposal.id,
      commonId: proposal.commonId,
      cardId: proposal.join.card.id,
      userId: proposal.user.id
    },
    metadata: {
      ipAddress: proposal.ipAddress || '127.0.0.1',
      email: proposal.user.email
    },

    type: PaymentType.OneTimePayment,
    amount: proposal.join.funding,
    circleCardId: proposal.join.card.circleCardId
  });

  // Set the state on the proposal
  await prisma.joinProposal.update({
    where: {
      id: proposal.join.id
    },
    data: {
      paymentState: ProposalPaymentState.Pending
    }
  });

  // Return the created payment
  return payment;
};