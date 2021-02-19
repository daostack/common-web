import { enumType } from 'nexus';

export const PaymentSourceEnum = enumType({
  name: 'PaymentSourceType',
  members: [
    'card'
  ]
});