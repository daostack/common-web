import { SharedOmit } from '@common/types';
import { firestore } from 'firebase-admin';
import { v4 } from 'uuid';

import { BaseEntityType } from '../../../util/types';

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

    createdAt: firestore.Timestamp.now(),
    updatedAt: firestore.Timestamp.now(),

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