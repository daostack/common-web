import { v4 } from 'uuid';
import admin from 'firebase-admin';
import Timestamp = admin.firestore.Timestamp;

import { BaseEntityType, SharedOmit } from '../../../util/types';

import { ICardEntity } from '../types';
import { CardCollection } from './index';

/**
 * Prepares the passed card for saving and saves it. Please note that
 * there is *no* validation being done here. *Do not use directly!*
 *
 * @param card - the card to be saved
 */
export const addCard = async (card: SharedOmit<ICardEntity, BaseEntityType>): Promise<ICardEntity> => {
  const cardDoc: ICardEntity = {
    id: v4(),

    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),

    ...card
  };

  if (process.env.NODE_ENV === 'test') {
    cardDoc['testCreated'] = true;
  }

  await CardCollection
    .doc(cardDoc.id)
    .set(cardDoc);

  return cardDoc;
};