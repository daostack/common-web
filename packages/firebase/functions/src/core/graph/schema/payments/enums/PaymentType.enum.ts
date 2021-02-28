import { enumType } from 'nexus';

export const PaymentTypeEnum = enumType({
  name: 'PaymentType',
  members: {
    oneTime: 'one-time',
    subscription: 'subscription'
  }
});