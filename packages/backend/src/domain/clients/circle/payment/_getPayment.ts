import { ICirclePayment } from '@circle/types/Payment/Payment';
import { $circleClient } from '@circle/client';

interface IGetCirclePaymentResponse {
  data: ICirclePayment;
}

export const _getPayment = async (circlePaymentId: string): Promise<IGetCirclePaymentResponse> => {
  const response = await $circleClient.get<IGetCirclePaymentResponse>(`/payments/${circlePaymentId}`);

  return response.data;
};