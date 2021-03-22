import { ICircleCard } from '@circle/types';
import { $circleClient } from '@circle/client';

interface IGetCircleCardResponse {
  data: ICircleCard;
}

export const _getCircleCard = async (id: string): Promise<IGetCircleCardResponse> => {
  const response = await $circleClient.get<IGetCircleCardResponse>(`/cards/${id}`);

  return response.data;
};