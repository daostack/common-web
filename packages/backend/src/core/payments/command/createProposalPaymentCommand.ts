import { FundingType, Payment, PaymentType, ProposalPaymentState } from '@prisma/client';

import { prisma } from '@toolkits';
import { NotFoundError, CommonError } from '@errors';

import { createPaymentCommand } from './createPaymentCommand';

/**
 * Create payment for one time proposal. Returns the processed payment
 *
 * @param proposalId - The ID of the proposal for witch to create payment
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

      common: {
        select: {
          fundingType: true
        }
      },

      join: {
        select: {
          id: true,
          funding: true,
          paymentState: true,

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

  if (
    proposal.join.paymentState !== ProposalPaymentState.NotAttempted &&
    proposal.join.paymentState !== ProposalPaymentState.Failed
  ) {
    throw new CommonError('Cannot create payment for proposal with pending or confirmed payment');
  }

  if (proposal.common.fundingType !== FundingType.OneTime) {
    throw new CommonError('Cannot create payment for proposal that is not of a one time funding type');
  }

  // Create the payment
  const payment = await createPaymentCommand({
    connect: {
      commonId: proposal.commonId,
      cardId: proposal.join.card.id,
      joinId: proposal.join.id,
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