import { PaymentType } from '@prisma/client';
import { enumType } from 'nexus';

export const PaymentTypeEnum = enumType({
  name: 'PaymentType',
  members: PaymentType
});