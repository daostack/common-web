import { PaymentType, ProposalPaymentState } from '@prisma/client';
import { prisma } from '@toolkits';
import { CommonError } from '@errors';
import { commonService } from '@services';

export const processSuccessfulOneTimePayment = async (paymentId: string): Promise<void> => {
  // Find the payment
  const { join, ...payment } = (await prisma.payment.findUnique({
    where: {
      id: paymentId
    },
    include: {
      join: true
    }
  }))!;

  if (payment.type !== PaymentType.OneTimePayment) {
    throw new CommonError('Cannot process payment');
  }

  // Update the proposal payment state
  await prisma.joinProposal.update({
    where: {
      id: join.id
    },
    data: {
      paymentState: ProposalPaymentState.Confirmed
    }
  });

  // Create membership for the user
  await commonService.createMember({
    commonId: payment.commonId,
    userId: payment.userId
  });

  // @todo Send notifications
};