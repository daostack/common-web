import { CommonError, NotFoundError } from '../../../domain/errors/index';
import { FundingType, Payment, PaymentStatus, PaymentType } from '@prisma/client';

import { prisma } from '../../../domain/toolkits/index';
import { createPaymentCommand } from './createPaymentCommand';

export const createOneTimePaymentCommand = async (proposalId: string): Promise<Payment> => {
  // Find the proposal (and linked payments if any)
  const proposal = await prisma.proposal.findUnique({
    where: {
      id: proposalId
    },
    include: {
      user: true,
      join: {
        include: {
          card: true,
          payment: {
            where: {
              status: {
                in: [
                  PaymentStatus.Successful,
                  PaymentStatus.Pending
                ]
              }
            }
          }
        }
      }
    }
  });


  // Validate the request

  if (!proposal) {
    throw new NotFoundError('proposal', proposalId);
  }

  if (!proposal.join) {
    throw new CommonError('Invalid proposal type');
  }

  if (proposal.join.fundingType !== FundingType.OneTime) {
    throw new CommonError('Invalid funding type');
  }

  if (proposal.join.payment.length) {
    throw new CommonError('Cannot create new payment for one time proposal', {
      payments: proposal.join.payment
    });
  }

  // Create the local payment and return it
  return createPaymentCommand({
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
};
