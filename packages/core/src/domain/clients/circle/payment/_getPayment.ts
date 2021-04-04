import { ICirclePayment } from 'packages/core/src/domain/clients/circle/types/Payment/Payment';
import { $circleClient } from 'packages/core/src/domain/clients/circle/client';

interface IGetCirclePaymentResponse {
  data: ICirclePayment;
}

export const _getPayment = async (circlePaymentId: string): Promise<IGetCirclePaymentResponse> => {
  const response = await $circleClient.get<IGetCirclePaymentResponse>(`/payments/${circlePaymentId}`);

  return response.data;
};