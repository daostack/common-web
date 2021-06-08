import { PayoutStatus } from '@prisma/client';
import { enumType } from 'nexus';

export const PayoutStatusEnum = enumType({
  name: 'PayoutStatus',
  members: PayoutStatus
});