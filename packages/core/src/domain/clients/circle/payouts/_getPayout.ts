import { ICirclePayout } from '@circle/payouts/_createPayout';
import { $circleClient } from '@circle/client';

export interface ICirclePayoutResponse {
  data: ICirclePayout;
}

export const _getPayout = async (circlePayoutId: string): Promise<ICirclePayoutResponse> => {
  const response = await $circleClient.get<ICirclePayoutResponse>(`/payouts/${circlePayoutId}`);

  return response.data;
};