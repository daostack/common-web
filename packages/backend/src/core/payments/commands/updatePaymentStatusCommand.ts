import { Payment } from '@prisma/client';
import { prisma } from '@toolkits';
import { circleClient } from '@clients';
import { convertCirclePaymentStatus } from '../helpers';

interface IUpdatePaymentStatusResult {
  initialPayment: Payment;
  updatedPayment: Payment;

  statusChange: boolean;
}

export const updatePaymentStatusCommand = async (paymentId: string): Promise<IUpdatePaymentStatusResult> => {
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
    updatedPayment = await prisma.payment.update({
      where: {
        id: paymentId
      },
      data: {
        status: convertCirclePaymentStatus(circlePayment.data.status),
        circlePaymentStatus: circlePayment.data.status
      }
    });
  }

  // Return the result
  return {
    initialPayment,
    updatedPayment,

    statusChange: initialPayment.status !== updatedPayment.status
  };
};