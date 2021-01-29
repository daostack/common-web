import { IPaymentEntity } from '../types';

const successfulStatuses = ['confirmed', 'paid'];
const terminalStatuses = ['paid', 'failed'];
const failedStatuses = ['failed'];

export const isSuccessful = (payment: IPaymentEntity): boolean =>
  successfulStatuses.some(status => status === payment.status);

export const isFinalized = (payment: IPaymentEntity): boolean =>
  terminalStatuses.some(status => status === payment.status);

export const isPending = (payment: IPaymentEntity): boolean =>
  payment.status === 'pending';

export const isFailed = (payment: IPaymentEntity): boolean =>
  failedStatuses.some(status => status === payment.status);
