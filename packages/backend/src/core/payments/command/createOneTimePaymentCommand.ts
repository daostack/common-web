import { FundingType, Payment, PaymentType, ProposalPaymentState } from '@prisma/client';
import { prisma } from '@toolkits';
import { NotFoundError, CommonError } from '@errors';
import { shouldCreateOneTimePaymentQuery } from '../queries/shouldCreateOneTimePaymentQuery';
import { createPaymentCommand } from './createPaymentCommand';

export const createOneTimePaymentCommand = async (proposalId: string): Promise<Payment> => {
  const proposal = await prisma.proposal.findUnique({
    where: {
      id: proposalId
    },
    include: {
      user: true,
      join: {
        include: {
          card: true
        }
      }
    }
  });

  if (!proposal) {
    throw new NotFoundError('proposal', proposalId);
  }

  if (!proposal.join) {
    throw new CommonError('Cannot create payments for non join proposals');
  }

  if (proposal.join.fundingType !== FundingType.OneTime) {
    throw new CommonError('Cannot create payment for non one time subscription');
  }

  if (!(await shouldCreateOneTimePaymentQuery(proposalId))) {
    throw new CommonError('Cannot create payment for proposal', {
      message:
        `Cannot create payment for proposal cause the shouldCreatePayment query returned false. Please contact ` +
        `support if you thing the payment should be made. ProposalID: ${proposalId}`
    });
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

  await prisma.joinProposal.update({
    where: {
      id: proposal.join.id
    },
    data: {
      paymentState: ProposalPaymentState.Pending
    }
  });

  // Return the payment
  return payment;
};