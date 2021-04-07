import { Payment, PaymentStatus } from '@prisma/client';

import { prisma } from '@toolkits';
import { commonService } from '../../../index';

export const processOneTimePayment = async (payment: Payment): Promise<void> => {
  // Update the proposal status
  const proposal = await prisma.joinProposal.update({
    where: {
      id: payment.joinId
    },
    data: {
      paymentState: payment.status
    }
  });

  // If the payment was successful mint membership
  if (payment.status === PaymentStatus.Successful) {
    await commonService.createMember({
      userId: payment.userId,
      commonId: payment.commonId
    });
  }

  // @todo Send notifications and emails
};