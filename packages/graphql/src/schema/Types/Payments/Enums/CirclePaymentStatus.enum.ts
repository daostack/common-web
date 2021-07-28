import { PaymentCircleStatus } from '@prisma/client';
import { enumType } from 'nexus';

export const PaymentCircleStatusEnum = enumType({
  name: 'PaymentCircleStatus',
  members: PaymentCircleStatus
});