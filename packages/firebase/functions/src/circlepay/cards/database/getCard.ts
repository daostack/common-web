import { ArgumentError, NotFoundError } from '../../../util/errors';

import { ICardEntity } from '../types';
import { CardCollection } from './index';

/**
 * Gets card by id
 *
 * @param cardId - The ID of the card, that you want to find. Please note
 *                that this is the local ID of the card and not the one,
 *                provided by Circle
 *
 * @throws { ArgumentError } - If the cardId param is with falsy value
 * @throws { NotFoundError } - If the card is not found
 *
 * @returns - The found card
 */
export const getCard = async (cardId: string): Promise<ICardEntity> => {
  if (!cardId) {
    throw new ArgumentError('cardId', cardId);
  }

  const card = (await CardCollection
    .doc(cardId)
    .get()).data();

  if (!card) {
    throw new NotFoundError(cardId, 'card');
  }

  return card;
};