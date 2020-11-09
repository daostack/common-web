import { Utils } from '../util/util';
import { createAPayment } from './circlepay';
import { updateCard } from '../util/db/cardDb';
import { updatePayment, pollPaymentStatus } from '../util/db/paymentDb';
import {ethers} from 'ethers';
import v4 from 'uuid';

interface IPaymentResp {
  id: string,
  type: string,
  source: {id: string, type: string},
  amount: {amount: string, currency: string},
  status: string,
  refunds: string[],
  createDate: string,
  updateDate: string,
}

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
}

export const createPayment = async (req: IRequest) : Promise<any> => {
  let result = 'Could not process payment.';
  const {proposerId, proposalId, funding, ipAddress} = req;
  const cardData = await Utils.getCardByProposalId(proposalId)

  // if proposal is associeated with a card
  if (cardData) {
    const user = await Utils.getUserById(proposerId);
    const paymentData = {
      idempotencyKey: v4(),
      proposalId,
      metadata: {
        email: user.email, 
        sessionId: ethers.utils.id(proposerId).substring(0,50),
        ipAddress,
      },
      amount: {
        amount: `${funding}`,
        currency: 'USD',
      },
      verification: 'none',
      source: {
        id: cardData.cardId,
        type: 'card'
      },
    }
    // an error that needs attention: functions: Error: socket hang up, use promiseRetry
    const {data} = await createAPayment(paymentData);

    if (data) {
      _updatePayment(data.data, proposalId);
      cardData.payments.push(data.data.id);
      await updateCard(cardData.id, cardData);
      result = `Payment created. PaymentdId: ${data.data.id}`;
    }
    pollPaymentStatus(data.data);
  } 
  // else if proposal is not associated with card?
  return `Create Payment: ${result}`;
}
