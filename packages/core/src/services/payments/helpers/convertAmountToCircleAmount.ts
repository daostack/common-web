import { ICirclePaymentAmount } from '@common/backend/dist/domain/clients/circle/types/Payment/PaymentAmount';

export const convertAmountToCircleAmount = (amount: number): ICirclePaymentAmount => ({
  amount: Math.round(amount) / 100,
  currency: 'USD'
});