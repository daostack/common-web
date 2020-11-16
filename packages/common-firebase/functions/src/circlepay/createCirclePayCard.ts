import express from 'express';
import { Utils } from '../util/util';
import { createCard } from './circlepay';
import cardDb, { updateCard } from '../util/db/cardDb';
import { v4 } from 'uuid';
import { CommonError } from '../util/errors';
import axios from 'axios';

const _updateCard = async (userId: string, id: string, proposalId: string): Promise<any> => {
  const doc = {
    id,
    userId,
    proposals: [proposalId],
    creationData: new Date(),
    payments: []
  };

  if (proposalId) {
    console.warn('Creating card without proposal ID');
  }

  await updateCard(id, doc);
};

// try to use ICardData from ./circlepay
interface IRequest {
  headers: { host?: string },
  body: {
    idToken: string,
    billingDetails: {
      name: string,
      city: string,
      country: string,
      line1: string,
      postalCode: string,
      district: string,
    },
    expMonth: number,
    expYear: number,
    idempotencyKey: string,
    proposalId: string,
    metadata: {
      email: string,
      ipAddress: string,
      sessionId: string,
    }
    keyId: string,
    encryptedData: string,
  }
}

interface ICardCreatedPayload {
  cardId: string;
}

export const createCirclePayCard = async (req: IRequest): Promise<ICardCreatedPayload> => {
  const { idToken, ...cardData } = req.body;

  const uid = await Utils.verifyId(idToken);

  cardData.metadata.ipAddress = req.headers['x-forwarded-for'] || '127.0.0.1';  //req.headers.host.includes('localhost') ? '127.0.0.1' : req.headers.host; //ip must be like xxx.xxx.xxx.xxx, and not a text
  cardData.metadata.sessionId = v4(); //ethers.utils.id(cardData.proposalId).substring(0,50);
  cardData.idempotencyKey = v4();

  const { data } = await createCard(cardData);
  
  await _updateCard(uid, data.id, cardData.proposalId);

  return {
    cardId: data.id
  };
};

interface ITestIpPayload {
  ip: string;
}

export const testIP = async (): Promise<ITestIpPayload> => {
  const response = await axios.get('https://api.ipify.org?format=json');
  return {
    ip: response.data
  };
};

/**
 * Assigns already created card to given proposal
 *
 * @param req - The express request
 *
 * @return Promise
 */
export const assignCard = async (req: express.Request): Promise<void> => {
  const { idToken, cardId, proposalId } = req.body;

  const userId = await Utils.verifyId(idToken);
  const card = (await cardDb.getCardRef(cardId).get()).data();

  if (card.userId !== userId) {
    // @todo Custom CommonValidationError?
    throw new CommonError(`
      Cannot update the proposal of card with ID ${cardId} 
      because the user (${userId}), updating it, is not the owner!
    `);
  }

  if (card.proposals.lenght > 0) {
    // @todo Instead of throwing error should I just allow assignment
    //  of more than one proposal to card?
    throw new CommonError(`
       Cannot assign card (${cardId}) to proposal because
       the card is already assigned!
    `);
  }


  console.log(`
    Assigning card with id ${cardId} to proposal with id ${proposalId}
  `);

  await cardDb.updateCard(cardId, {
    proposals: [proposalId]
  });
};

/**
 * The raw version of assignCard();
 * Please not that here we do not validate anything, so use with caution
 *
 * @param cardId - the id of the card that we want to assign
 * @param proposalId - the id of the proposal that we want to assign to
 *
 * @return { Promise }
 */
export const assignCardToProposal = async (cardId: string, proposalId: string): Promise<void> => {
  const card = (await cardDb.getCardRef(cardId).get()).data();

  if (card.proposals.lenght > 0) {
    // @todo Instead of throwing error should I just allow assignment
    //  of more than one proposal to card?
    throw new CommonError(`
       Cannot assign card (${cardId}) to proposal because
       the card is already assigned!
    `);
  }

  await cardDb.updateCard(cardId, {
    proposals: [proposalId]
  });
};

export default {
  createCirclePayCard,
  assignCard
};