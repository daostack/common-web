import { cardDb } from '../database';

/**
 * Checks if the user is the creator of the card
 *
 * @param userId - The user ID, that we want to verify is the owner
 * @param cardId - The ID of the card, against which we want to check
 */
export const isCardOwner = async (userId: string, cardId: string): Promise<boolean> => {
  return (await cardDb.get(cardId)).ownerId === userId;
};