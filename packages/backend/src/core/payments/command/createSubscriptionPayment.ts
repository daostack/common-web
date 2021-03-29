import { PaymentStatus } from '@prisma/client';
import { NotImplementedError } from '@errors';

export const createSubscriptionPayment = async (): Promise<PaymentStatus> => {
  throw new NotImplementedError();
};