import { ICirclePaymentAmount } from '@circle/types';

export const convertAmountToCircleAmount = (amount: number): ICirclePaymentAmount => ({
  amount: Math.round(amount) / 100,
  currency: 'USD'
});