import { Payment, PaymentStatus, PaymentType, SubscriptionStatus } from '@prisma/client';

import { logger as $logger } from '@logger';
import { prisma } from '@toolkits';
import { CommonError } from '@errors';
import { createPaymentCommand } from './createPaymentCommand';

export const createSubscriptionPaymentCommand = async (subscriptionId: string): Promise<Payment> => {
  const logger = $logger.child({
    functionName: 'createSubscriptionPaymentCommand',
    params: {
      subscriptionId
    }
  });

  // Check the subscription status, check if there are pending payments for the subscription
  if (await prisma.payment.count({
    where: {
      subscriptionId,
      status: {
        in: [
          PaymentStatus.Pending,
          PaymentStatus.NotAttempted
        ]
      }
    }
  })) {
    throw new CommonError('Cannot create subscription payment for subscription that has pending payments', {
      subscriptionId
    });
  }

  logger.info('Creating subscription payment');

  const subscription = (await prisma.subscription.findUnique({
    where: {
      id: subscriptionId
    },
    include: {
      user: true,
      card: true,
      join: true
    }
  }))!;


  const paymentType = subscription.status === SubscriptionStatus.Pending
    ? PaymentType.SubscriptionInitialPayment
    : PaymentType.SubscriptionSequentialPayment;

  return createPaymentCommand({
    connect: {
      commonId: subscription.commonId,
      cardId: subscription.cardId,
      joinId: (subscription.join)!.id,
      userId: subscription.userId,
      subscriptionId: subscription.id
    },

    metadata: {
      ipAddress: '127.0.0.1',
      email: subscription.user.email
    },

    type: paymentType,
    amount: subscription.amount,
    circleCardId: subscription.card.circleCardId
  });
};