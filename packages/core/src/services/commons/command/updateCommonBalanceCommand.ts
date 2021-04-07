import { Common, Payment, PaymentStatus } from '@prisma/client';

import { CommonError } from '../../../domain/errors/index';
import { prisma } from '../../../domain/toolkits/index';
import { logger } from '../../../domain/utils/logger';

/**
 * Updates the common balance with the payment
 *
 * @param payment - The payment
 */
export const updateCommonBalanceCommand = async (payment: Payment): Promise<Common> => {
  if (payment.processed) {
    throw new CommonError('Cannot update the common balance with processed payment');
  }

  if (payment.status !== PaymentStatus.Successful) {
    throw new CommonError('Cannot update the common balance with payment that is not successful');
  }

  logger.info('Updating common balance');

  // Update the balance and return the updated common
  return prisma.common.update({
    where: {
      id: payment.commonId
    },
    data: {
      balance: {
        increment: payment.amount
      },
      raised: {
        increment: payment.amount
      }
    }
  });
};