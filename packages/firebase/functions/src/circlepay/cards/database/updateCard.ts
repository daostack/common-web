import { firestore } from 'firebase-admin';

import { ICardEntity } from '../types';
import { CardCollection } from './index';


/**
 * Updates the passed entity in the database. Reference
 * is kept from the ID of the entity, so if the ID is changed (please,
 * don't do this) new entity will be created
 *
 * @param card - The card entity to update
 *
 * @returns - The updated card entity
 */
export const updateCardInDatabase = async (card: ICardEntity): Promise<ICardEntity> => {
  const cardDoc = {
    ...card,

    updatedAt: firestore.Timestamp.now()
  };

  await CardCollection
    .doc(cardDoc.id)
    .update(cardDoc);

  return cardDoc;
}