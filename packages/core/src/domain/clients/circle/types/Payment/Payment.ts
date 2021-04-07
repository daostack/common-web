import { CirclePaymentStatus, IPaymentFee } from '..';

export interface ICirclePayment {
  id: string;
  type: 'payment';
  status: CirclePaymentStatus;
  fees: IPaymentFee;

  [key: string]: any;
}