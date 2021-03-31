import { PaymentType } from '@prisma/client';
import { prisma } from '@toolkits';
import { processOneTimePayment } from './proccessOneTimeProposalPayment';

export const processPaymentCommand = async (paymentId: string): Promise<void> => {
  const payment = (await prisma.payment.findUnique({
    where: {
      id: paymentId
    }
  }))!;

  if (payment.processed || payment.processedError) {
    return;
  }

  try {
    if (payment.type === PaymentType.OneTimePayment) {
      await processOneTimePayment(payment);
    }
  } catch (e) {
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