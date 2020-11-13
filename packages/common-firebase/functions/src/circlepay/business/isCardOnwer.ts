import { db } from '../../settings';
import { Collections } from '../../constants';

/**
 * Checks if the user is the creator of the card
 *
 * @param userId - The user ID, that we want to verify is the owner
 * @param cardId - The ID of the card, against which we want to check
 */
export const isCardOwner = async (userId: string, cardId: string): Promise<boolean> => {
  // @todo Circle DB?
  const card = (await db.collection(Collections.Cards).doc(cardId).get()).data();

  return card.userId === userId;
};