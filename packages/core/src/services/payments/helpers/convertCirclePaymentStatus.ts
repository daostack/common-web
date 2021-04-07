import { PaymentStatus } from '@prisma/client';

import { CommonError } from '../../../domain/errors/index';
import { CirclePaymentStatus } from '../../../domain/clients/circle/types';

export const convertCirclePaymentStatus = (status: CirclePaymentStatus): PaymentStatus => {
  switch (status) {
    case 'confirmed':
    case 'paid':
      return PaymentStatus.Successful;
    case 'failed':
      return PaymentStatus.Unsuccessful;
    case 'pending':
      return PaymentStatus.Pending;
    default:
      throw new CommonError(`Unknown circle status ${status}`);
  }
};