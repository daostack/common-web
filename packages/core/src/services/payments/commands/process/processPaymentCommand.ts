import { PaymentStatus, PaymentType } from '@prisma/client';

import { prisma } from '@toolkits';
import { logger } from '@logger';

import { processOneTimePayment } from './processOneTimeProposalPayment';
import { processSubscriptionPayment } from './processSubscriptionPayment';
import { updateCommonBalanceWithPaymentCommand } from '../../../commons/command/updateCommonBalanceWithPaymentCommand';

export const processPaymentCommand = async (paymentId: string): Promise<void> => {
  const payment = (await prisma.payment.findUnique({
    where: {
      id: paymentId
    }
  }))!;

  if (payment.processed || payment.processedError) {
    logger.warn('Cannot process payment that has been already processed, or has errored during processing', {
      payment
    });

    return;
  }


  try {
    logger.info(`Starting processing of the payment with id ${paymentId}`);

    // If the payment was successful update the common balance
    if (payment.status === PaymentStatus.Successful) {
      await updateCommonBalanceWithPaymentCommand(payment);
    }

    if (payment.type === PaymentType.OneTimePayment) {
      await processOneTimePayment(payment);
    } else if (
      payment.type === PaymentType.SubscriptionInitialPayment ||
      payment.type === PaymentType.SubscriptionSequentialPayment
    ) {
      await processSubscriptionPayment(payment);
    }
  } catch (e) {
    logger.error('An error occurred while processing payment', {
      error: e
    });

    await prisma.payment.update({
      where: {
        id: paymentId
      },
      data: {
        processedError: true
      }
    });
  } finally {
    await prisma.payment.update({
      where: {
        id: paymentId
      },
      data: {
        processed: true
      }
    });
  }
};