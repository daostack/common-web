import { ICirclePaymentAmount } from '@circle/types/Payment/PaymentAmount';

export const convertAmountToCircleAmount = (amount: number): ICirclePaymentAmount => ({
  amount: Math.round(amount) / 100,
  currency: 'USD'
});