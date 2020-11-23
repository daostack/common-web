import { Utils } from '../util/util';
import { createAPayment } from './circlepay';
import { updateCard, getCardByProposalId } from '../util/db/cardDb';
import { updatePayment, pollPaymentStatus, IPaymentResp } from '../util/db/paymentDb';
import {v4} from 'uuid';
import { CommonError } from '../util/errors/CommonError';

const _updatePayment = async (paymentResponse: IPaymentResp, proposalId: string) : Promise<any> => {
  const doc = {
    id: paymentResponse.id,
    type: paymentResponse.type,
    proposalId,
    source: paymentResponse.source,
    amount: paymentResponse.amount,
    status: paymentResponse.status,
    refunds: paymentResponse.refunds,
    creationDate: paymentResponse.createDate,
    updateDate: paymentResponse.updateDate
  };
  await updatePayment(paymentResponse.id, doc);
}

interface IRequest {
  ipAddress: string,
  proposerId: string,
  proposalId: string,
  funding: number,
  sessionId: string,
}

export const createPayment = async (req: IRequest) : Promise<any> => {
  let result = 'Could not process payment.';
  const {proposerId, proposalId, funding, ipAddress} = req;
  const cardData = await getCardByProposalId(proposalId);

  // if proposal is associeated with a card
  if (cardData) {
    const user = await Utils.getUserById(proposerId);
    const paymentData = {
      idempotencyKey: v4(),
      proposalId,
      metadata: {
        email: user.email, 
        sessionId: req.sessionId,
        ipAddress,
      },
      amount: {
        amount: `${funding / 100}`,
        currency: 'USD',
      },
      verification: 'none',
      source: {
        id: cardData.id,
        type: 'card'
      },
    }

    const {data} = await createAPayment(paymentData);

    if (data) {
      _updatePayment(data.data, proposalId);
      cardData.payments.push(data.data.id);
      await updateCard(cardData);
      result = `Payment created. PaymentdId: ${data.data.id}`;
    }
    pollPaymentStatus(data.data, proposerId, proposalId);
  } else {
    throw new CommonError(`Could not find card with proposalId (${proposalId}).`);
  } 
  return `Create Payment: ${result}`;
}
