import { db } from '../../settings';
import { DocumentData, DocumentReference } from '@google-cloud/firestore';
import { Collections } from '../../constants';

export const updateCard = async (cardId: string, doc: DocumentData): Promise<any> => (
  await db.collection(Collections.Cards)
    .doc(cardId)
    .set(
      doc,
      {
        merge: true
      }
    )
);

/**
 * Returns the card document reference by the card ID
 *
 * @param cardId - The ID of the card
 */
export const getCardRef = (cardId: string): DocumentReference => {
  return db.collection(Collections.Cards).doc(cardId);
};


export default {
  updateCard,
  getCardRef
};