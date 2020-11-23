import { db } from '../../settings';
import { DocumentData, DocumentReference } from '@google-cloud/firestore';
import { Collections } from '../../constants';
import {getProposalById} from './proposalDbService';
import { CommonError } from '../../util/errors/CommonError';

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

  export const getCardById = async (cardId: string) : Promise<any> => {
    const cardRef = db.collection('cards').doc(cardId);
    const cardData = await cardRef.get().then(doc => doc.data());
    if (!cardData) {
      throw new CommonError(`Could not find card with id ${cardId}.`)
    }
    return cardData;
  }

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
  getCardRef,
  getCardByProposalId,
  createNewCard
};
