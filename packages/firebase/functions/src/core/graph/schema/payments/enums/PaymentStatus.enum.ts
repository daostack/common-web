import { enumType } from 'nexus';

export const PaymentStatusEnum = enumType({
  name: 'PaymentStatus',
  members: [
    'pending',
    'confirmed',
    'paid',
    'failed'
  ]
});