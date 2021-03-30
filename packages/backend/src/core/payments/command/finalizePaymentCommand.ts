import { prisma } from '@toolkits';
import { NotFoundError, CommonError } from '@errors';
import { PaymentStatus, PaymentType } from '@prisma/client';

import { IUpdatePaymentStatusResult, updatePaymentStatusCommand } from './updatePaymentStatusCommand';
import { poll } from '@utils';
import { processSuccessfulOneTimePayment } from './process/processSuccessfulOneTimePayment';

const terminalPaymentStatuses = [
  PaymentStatus.Successful,
  PaymentStatus.Unsuccessful
];

export const finalizePaymentCommand = async (paymentId: string): Promise<IUpdatePaymentStatusResult> => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId
    }
  });

  if (!payment) {
    throw new NotFoundError('payment', paymentId);
  }

  const pollFn = (): Promise<IUpdatePaymentStatusResult> => {
    return updatePaymentStatusCommand(paymentId);
  };

  const pollValidator = (update: IUpdatePaymentStatusResult): boolean => {
    return terminalPaymentStatuses.includes(update.local.currentStatus as any);
  };

  const paymentUpdate = await poll<IUpdatePaymentStatusResult>(pollFn, pollValidator);

  if (paymentUpdate.local.statusChange && paymentUpdate.paymentSuccessful) {
    switch (payment.type) {
      case PaymentType.OneTimePayment:
        await processSuccessfulOneTimePayment(paymentId);

        break;
      default:
        throw new CommonError('Payment type unsupported');
    }
  }

  return paymentUpdate;
};