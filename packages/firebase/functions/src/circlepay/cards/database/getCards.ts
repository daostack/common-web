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

  sort?: {
    /**
     * Order the result set by this field
     * in descending order
     */
    orderByDesc?: keyof ICardEntity;

    /**
     * Order the results set by this field
     * in ascending order
     */
    orderByAsc?: keyof ICardEntity;

    /**
     * The maximum number of records that can
     * be returned
     */
    limit?: number;
  }
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

  if (options.sort) {
    const { sort } = options;

    if (sort.orderByAsc) {
      cardsQuery = cardsQuery.orderBy(sort.orderByAsc);
    } else if (sort.orderByDesc) {
      cardsQuery = cardsQuery.orderBy(sort.orderByDesc, 'desc');
    }

    if (sort.limit) {
      cardsQuery = cardsQuery.limit(sort.limit);
    }
  }

  return (await cardsQuery.get()).docs
    .map(card => card.data());
};