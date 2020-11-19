import { createCard } from './circlepay';
import { updateCard } from '../util/db/cardDb';
import { v4 } from 'uuid';
import * as cardDb from '../util/db/cardDb';
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

  const uid: string = req.user.uid;

  cardData.metadata.ipAddress = req.headers['x-forwarded-for'] || '127.0.0.1';  //req.headers.host.includes('localhost')
                                                                                // ? '127.0.0.1' : req.headers.host;
                                                                                // //ip must be like xxx.xxx.xxx.xxx,
                                                                                // and not a text
  cardData.metadata.sessionId = v4(); //ethers.utils.id(cardData.proposalId).substring(0,50);
  cardData.idempotencyKey = v4();

  const {data} = await createCard(cardData);

  await _updateCard(uid, data.id, cardData.proposalId);

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

  if (card.proposals.some(x => x === proposalId)) {
    // The proposal is already assigned to
    // that card so just return
    return;
  }

  await cardDb.updateCard(cardId, {
    proposals: [
      ...card.proposals,
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