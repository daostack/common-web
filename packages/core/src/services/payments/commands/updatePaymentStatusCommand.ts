import { Payment, PaymentStatus } from '@prisma/client';

import { prisma } from '../../../domain/toolkits/index';
import { circleClient } from '../../../domain/clients/index';
import { logger as $logger } from '../../../domain/utils/logger';
import { convertCirclePaymentStatus } from '../helpers';
import { worker } from '@common/queues';

export interface IUpdatePaymentStatusResult {
  initialPayment: Payment;
  updatedPayment: Payment;

  statusChange: boolean;
}

export const updatePaymentStatusCommand = async (paymentId: string): Promise<IUpdatePaymentStatusResult> => {
  const logger = $logger.child({
    functionName: 'updatePaymentStatusCommand',
    payload: {
      paymentId
    }
  });

  // Find the payment
  const initialPayment = (await prisma.payment.findUnique({
    where: {
      id: paymentId
    }
  }))!;

  // Fetch the payment from circle
  const circlePayment = await circleClient.payments.get(initialPayment.circlePaymentId as string);

  // Update the payment if there is status change
  let updatedPayment: Payment = initialPayment;

  if (initialPayment.circlePaymentStatus !== circlePayment.data.status) {
    logger.info('Payment status change occurred', {
      previousStatus: initialPayment.circlePaymentStatus,
      newStatus: circlePayment.data.status
    });

    updatedPayment = await prisma.payment.update({
      where: {
        id: paymentId
      },
      data: {
        status: convertCirclePaymentStatus(circlePayment.data.status),
        circlePaymentStatus: circlePayment.data.status
      }
    });

    logger.silly('here');

    // Process the payment if final state is reached
    if (
      (updatedPayment.status === PaymentStatus.Successful || updatedPayment.status === PaymentStatus.Unsuccessful) &&
      (initialPayment.status !== PaymentStatus.Successful && initialPayment.status !== PaymentStatus.Unsuccessful)
    ) {
      logger.debug('Processing payment, reached final state');

      worker.addPaymentJob('process', updatedPayment.id);
    }
  }

  // If the payment is not finalized schedule job for retrying the update
  if (updatedPayment.status === PaymentStatus.Pending) {
    logger.debug('After updating status payment is still pending. Scheduling retry');

    worker.addPaymentJob('updateStatus', updatedPayment.id);
  }

  // Return the result
  return {
    initialPayment,
    updatedPayment,

    statusChange: initialPayment.status !== updatedPayment.status
  };
};