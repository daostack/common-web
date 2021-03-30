import { PaymentCircleStatus, PaymentStatus } from '@prisma/client';

import { prisma } from '@toolkits';
import { circleClient } from '@clients';
import { NotFoundError, CommonError } from '@errors';

import { convertCirclePaymentStatus } from '../helpers';

export interface IUpdatePaymentStatusResult {
  circle: {
    currentStatus: PaymentCircleStatus,
    previousStatus: PaymentCircleStatus,

    statusChange: boolean
  },

  local: {
    currentStatus: PaymentStatus,
    previousStatus: PaymentStatus,

    statusChange: boolean
  }

  paymentSuccessful: boolean;
}

const successfulPaymentStatuses = [
  PaymentStatus.Successful
];

/**
 * Update the payment status from circle and broadcast events for it. It updates
 * the state only once and does not poll
 *
 * @param paymentId - The ID of the payment status in the database
 */
export const updatePaymentStatusCommand = async (paymentId: string): Promise<IUpdatePaymentStatusResult> => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId
    }
  });

  if (!payment) {
    throw new NotFoundError('payment', paymentId);
  }

  if (!payment.circlePaymentId) {
    throw new CommonError('Payment does not have linked circle payment!', {
      payment
    });
  }

  const circlePayment = await circleClient.payments.get(payment.circlePaymentId);

  const result: IUpdatePaymentStatusResult = {
    circle: {
      previousStatus: payment.circlePaymentStatus as PaymentCircleStatus,
      currentStatus: circlePayment.data.status,

      statusChange: payment.circlePaymentStatus !== circlePayment.data.status
    },

    local: {
      previousStatus: payment.status,
      currentStatus: convertCirclePaymentStatus(circlePayment.data.status),

      statusChange: convertCirclePaymentStatus(circlePayment.data.status) !== payment.status
    },

    paymentSuccessful: successfulPaymentStatuses.includes(convertCirclePaymentStatus(circlePayment.data.status) as any)
  };

  if (result.circle.statusChange) {
    await prisma.payment.update({
      where: {
        id: paymentId
      },
      data: {
        status: convertCirclePaymentStatus(circlePayment.data.status),
        circlePaymentStatus: circlePayment.data.status
      }
    });
  }

  return result;
};