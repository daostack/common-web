import { ICirclePayment } from '../types';
import { $circleClient } from '../client';

export interface IGetCirclePaymentResponse {
  data: ICirclePayment;
}

export const _getPayment = async (circlePaymentId: string): Promise<IGetCirclePaymentResponse> => {
  const response = await $circleClient.get<IGetCirclePaymentResponse>(`/payments/${circlePaymentId}`);

  return response.data;
};