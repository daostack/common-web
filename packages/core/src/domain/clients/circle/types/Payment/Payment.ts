import { CirclePaymentStatus, IPaymentFee } from 'packages/core/src/domain/clients/circle/types';

export interface ICirclePayment {
  id: string;
  type: 'payment';
  status: CirclePaymentStatus;
  fees: IPaymentFee;

  [key: string]: any;
}