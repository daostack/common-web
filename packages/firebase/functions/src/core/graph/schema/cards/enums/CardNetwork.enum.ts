import { enumType } from 'nexus';

export const CardNetworkEnum = enumType({
  name: 'CartNetwork',
  members: {
    visa: 'VISA',
    mastercard: 'MASTERCARD'
  }
});