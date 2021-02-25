import { enumType } from 'nexus';

export const CardNetworkEnum = enumType({
  name: 'CardNetwork',
  members: {
    visa: 'VISA',
    mastercard: 'MASTERCARD'
  }
});