import { CirclePaymentStatus } from '@circle/types';
import { PaymentStatus } from '@prisma/client';

export const convertCirclePaymentStatus = (status: CirclePaymentStatus): PaymentStatus =>
  (status.charAt(0).toUpperCase() + status.slice(1)) as PaymentStatus;