import { enumType } from 'nexus';
import { ProposalPaymentState } from '@prisma/client';

export const PaymentStateEnum = enumType({
  name: 'PaymentState',
  members: ProposalPaymentState
});