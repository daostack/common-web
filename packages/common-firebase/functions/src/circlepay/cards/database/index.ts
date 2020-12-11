import { db } from '../../../util';
import { Collections } from '../../../constants';
import { ICardEntity } from '../types';

import { addCard } from './addCard';
import { getCard } from './getCard';
import { getCards } from './getCards';

export const CardCollection = db.collection(Collections.Cards)
  .withConverter<ICardEntity>({
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): ICardEntity {
      return snapshot.data() as ICardEntity;
    },
    toFirestore(object: ICardEntity | Partial<ICardEntity>): FirebaseFirestore.DocumentData {
      return object;
    }
  });

export const cardDb = {
  /**
   * Method, used for adding new circle cards in the firestore.
   * Requires nice and formatted documents as it does not do any
   * validation on them. It will return the created card with the
   * generated values for createdAt, updatedAt and the ID of the document
   */
  add: addCard,

  /**
   * Returns just one card by it's document ID. If no card is found NotFoundError
   * will be thrown
   */
  get: getCard,

  /**
   * Gets an array of card that match the provided options or if
   * no cards are found just an empty array
   */
  getMany: getCards
};