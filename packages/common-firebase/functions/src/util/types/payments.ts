import { CirclePaymentStatus } from './index';

export interface IPaymentEntity {
  id: string;

  source: IPaymentSource;
  amount: IPaymentAmount;
  refunds: IPaymentRefund[];

  type: PaymentType;
  status: CirclePaymentStatus;

  proposalId?: string;
  subscriptionId?: string;


  createDate: Date;
  updateDate: Date;
}

export interface IPaymentSource {
  id: string;
  type: string;
}

export interface IPaymentAmount {
  amount: string;
  currency: string;
}

export interface IPaymentRefund {
  id: string;
  type: 'payment' | string;
  amount: IPaymentAmount;
  status: CirclePaymentStatus;
}

export type PaymentType = 'OneTimePayment' | 'SubscriptionPayment';
