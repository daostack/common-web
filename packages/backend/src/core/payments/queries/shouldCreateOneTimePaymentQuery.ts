import { PaymentStatus } from '@prisma/client';
import { prisma } from '@toolkits';

const allowedStatuses = [
  PaymentStatus.Failed
];

export const shouldCreateOneTimePaymentQuery = async (proposalId: string): Promise<boolean> => {
  const payments = await prisma.payment.findMany({
    where: {
      join: {
        proposal: {
          id: proposalId
        }
      }
    },
    select: {
      id: true,
      status: true
    }
  });

  return !payments.some(p => !allowedStatuses.includes(p.status as any));
};