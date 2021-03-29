import * as z from 'zod';

import { EventType, Payment, PaymentStatus, ProposalType } from '@prisma/client';
import { prisma } from '@toolkits';
import { NotFoundError, CommonError } from '@errors';
import { circleClient } from '@clients';
import { convertAmountToCircleAmount } from '../helpers';
import { eventsService } from '@services';

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
      ipAddress: true,
      state: true,
      type: true,

      id: true,

      userId: true,
      commonId: true,
      commonMemberId: true,

      user: {
        select: {
          email: true
        }
      },

      join: {
        select: {
          paymentState: true,
          funding: true,

          cardId: true,

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
  if (!proposal || !proposal.join) {
    throw new NotFoundError('proposal', command.proposalId);
  }

  // Check if subscription
  if (proposal.join.subscription) {
    // @todo Create subscription payment
  }


  if (proposal.type !== ProposalType.JoinRequest || !proposal.commonMemberId) {
    throw new CommonError('Cannot create payment for proposal that is not join request or does not have linked member id');
  }

  // Create the payment
  let payment = await prisma.payment.create({
    data: {
      amount: proposal.join.funding,
      cardId: proposal.join.cardId,

      proposalId: proposal.id,

      commonMemberId: proposal.commonMemberId,
      commonId: proposal.commonId,
      userId: proposal.userId
    },
    include: {
      card: {
        select: {
          circleCardId: true,
          cvvCheck: true
        }
      }
    }
  });


  // Create the payment with Circle
  const circlePayment = await circleClient.payments.create({
    verification: 'none',
    idempotencyKey: payment.id,
    amount: convertAmountToCircleAmount(payment.amount),
    source: {
      type: 'card',
      id: payment.card.circleCardId
    },
    metadata: {
      ipAddress: proposal.ipAddress as string,
      sessionId: payment.id,
      email: proposal.user.email
    }
  });

  // Update the payment
  await prisma.payment.update({
    where: payment,
    data: {
      circlePaymentId: circlePayment.data.id,
      status: PaymentStatus.Pending
    }
  });

  // Create event
  await eventsService.create({
    type: EventType.PaymentCreated,
    commonId: proposal.commonId,
    userId: proposal.userId
  });

  // Create scheduled task for payment details update


  // Return the created payment
  return payment;
};
