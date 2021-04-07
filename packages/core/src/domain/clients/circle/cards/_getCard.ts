import { ICircleCard } from '../types';
import { $circleClient } from '../client';

export interface IGetCircleCardResponse {
  data: ICircleCard;
}

export const _getCircleCard = async (id: string): Promise<IGetCircleCardResponse> => {
  const response = await $circleClient.get<IGetCircleCardResponse>(`/cards/${id}`);

  return response.data;
};