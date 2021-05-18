import { PaymentStatus } from '@prisma/client';
import { enumType } from 'nexus';

export const PaymentStatusEnum = enumType({
  name: 'PaymentStatus',
  members: PaymentStatus
});