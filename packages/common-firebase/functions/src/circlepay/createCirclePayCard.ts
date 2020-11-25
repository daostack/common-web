import { createCard } from './circlepay';
import { createNewCard } from '../util/db/cardDb';
import { v4 } from 'uuid';
import * as cardDb from '../util/db/cardDb';
import axios from 'axios';
import { NotFoundError } from '../util/errors';

interface IRequest {
  headers: { host?: string },
  body: {
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
    metadata: {
      email: string,
      ipAddress: string,
      sessionId: string,
    }
    keyId: string,
    encryptedData: string,
  };
  user: {
    uid: string;
  }
}

interface ICardCreatedPayload {
  cardId: string;
}

export const createCirclePayCard = async (req: IRequest): Promise<ICardCreatedPayload> => {
  const cardData = req.body;
  cardData.metadata.ipAddress = req.headers['x-forwarded-for'] || '127.0.0.1';
  cardData.metadata.sessionId = v4();
  cardData.idempotencyKey = v4();

  const { data } = await createCard(cardData);
  
  await createNewCard({
      id: data.id,
      userId: req.user.uid,
      creationDate: new Date(),
      payments: []
  });

  return {
    cardId: data.id
  };
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

  if(!card) {
    throw new NotFoundError(cardId, 'card');
  }

  // If there are proposals on the card check if some
  // of them is the one that we are currently adding
  if (card.proposals && card.proposals.some(x => x === proposalId)) {
    return;
  }

  await cardDb.updateCard({
    id: cardId,
    proposals: [
      ...(card.proposals || []),
      proposalId
    ]
  });
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

export default {
  createCirclePayCard,
};
