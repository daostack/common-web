import { ICardEntity } from '../types';
import { CardCollection } from './index';

interface IGetCardOptions {
  /**
   * Find all cards by user
   */
  ownerId?: string;

  /**
   * Find all documents for one card
   * by the circle card ID
   */
  circleCardId?: string;
}

/**
 * Returns all cards matching the chosen options
 *
 * @param options - The options for filtering the cards
 */
export const getCards = async (options: IGetCardOptions): Promise<ICardEntity[]> => {
  let cardsQuery: any = CardCollection;

  if (options.ownerId) {
    cardsQuery = cardsQuery.where('ownerId', '==', options.ownerId);
  }

  if (options.circleCardId) {
    cardsQuery = cardsQuery.where('circleCardId', '==', options.circleCardId);
  }

  return (await cardsQuery.get()).docs
    .map(card => card.data());
};