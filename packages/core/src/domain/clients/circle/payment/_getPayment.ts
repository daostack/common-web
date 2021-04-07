import { ICirclePayment } from '@circle/types';
import { $circleClient } from '@circle/client';

export interface IGetCirclePaymentResponse {
  data: ICirclePayment;
}

export const _getPayment = async (circlePaymentId: string): Promise<IGetCirclePaymentResponse> => {
  const response = await $circleClient.get<IGetCirclePaymentResponse>(`/payments/${circlePaymentId}`);

  return response.data;
};