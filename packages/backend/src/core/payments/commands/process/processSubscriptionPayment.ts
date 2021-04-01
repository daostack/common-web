import { addMonths } from 'date-fns';
import { Payment, PaymentStatus, PaymentType, SubscriptionStatus } from '@prisma/client';

import { logger as $logger } from '@logger';
import { commonService } from '@services';
import { prisma } from '@toolkits';

export const processSubscriptionPayment = async (payment: Payment): Promise<void> => {
  const logger = $logger.child({
    functionName: 'processSubscriptionPayment',
    payload: {
      payment
    }
  });

  // Update the proposal state if this is initial payment
  if (payment.type === PaymentType.SubscriptionInitialPayment) {
    logger.info('Updating proposal payment status');

    await prisma.joinProposal.update({
      where: {
        id: payment.joinId
      },
      data: {
        paymentState: payment.status
      }
    });
  }

  // Update the subscription payment
  logger.info('Updating the subscription payment status');

  const subscription = await prisma.subscription.update({
    where: {
      id: payment.subscriptionId as string
    },
    data: {
      paymentStatus: payment.status as any
    }
  });

  // If this is the initial payment and it is successful add the member and activate the subscription
  if (payment.type === PaymentType.SubscriptionInitialPayment && payment.status === PaymentStatus.Successful) {
    logger.info('Successful initial subscription payment. Creating membership and activating subscription');

    await commonService.createMember({
      commonId: payment.commonId,
      userId: payment.userId
    });
  }

  // Update the subscription status if necessary
  if (subscription.status !== SubscriptionStatus.Active && subscription.status !== SubscriptionStatus.CanceledByUser) {
    await prisma.subscription.update({
      where: {
        id: subscription.id
      },
      data: {
        status: SubscriptionStatus.Active
      }
    });
  }

  // Update the subscription due date if the payment was successful
  if (payment.status === PaymentStatus.Successful) {
    await prisma.subscription.update({
      where: {
        id: subscription.id
      },
      data: {
        chargedAt: new Date(),
        dueDate: addMonths(subscription.dueDate, 1)
      }
    });
  }
};