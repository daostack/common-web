import { db } from '../../settings';
import { DocumentData, DocumentReference } from '@google-cloud/firestore';
import { Collections } from '../../constants';
import { ICardEntity, Nullable } from '../types';
import { CommonError } from '../errors';

import {getProposalById} from './proposalDbService';

export const createNewCard = async (doc: DocumentData): Promise<any> => (
  await updateCard(doc)
)

export const updateCard = async (doc: DocumentData): Promise<any> => (
  await db.collection(Collections.Cards)
    .doc(doc.id)
    .set(
      doc,
      {
        merge: true
      }
    )
);

export const getCardByProposalId = async (proposalId: string) : Promise<any> => {
  const proposal = (await getProposalById(proposalId)).data();
  return await getCardById(proposal.join.cardId);
}

/**
 * Returns the card document reference by the card ID
 *
 * @param cardId - The ID of the card
 */
export const getCardRef = (cardId: string): DocumentReference => {
  return db.collection(Collections.Cards).doc(cardId);
};

/**
 * Returns card entity by the ID of the card
 *
 * @param cardId - The ID of the card, that we want to retrieve
 *
 * @throws { CommonError } - If the card for that ID is not found
 *
 * @returns - The card, if found
 */
export const getCardById = async (cardId: string): Promise<ICardEntity> => {
  const card = (await db.collection(Collections.Cards)
    .doc(cardId)
    .get()).data() as Nullable<ICardEntity>;

  if(!card) {
    throw new CommonError(`Cannot find card with id ${cardId}`, {
      statusCode: 404
    });
  }

  return card;
}


export default {
  updateCard,
  getCardRef,
  getCardByProposalId,
  createNewCard
};
