import { db } from '../../settings';
import { getPayment } from '../../circlepay/circlepay';
import { Utils } from '../util';
import { EVENT_TYPES } from '../../event/event';
import { createEvent } from '../db/eventDbService';
import {Collections} from '../../constants';
import { DocumentData } from '@google-cloud/firestore';

const polling = async ({validate, interval, paymentId}) : Promise<any> => {
	console.log('start polling');
	let attempts = 0;
	
	const executePoll = async (resolve, reject) => {
    console.log(`- poll #${attempts}`);
    const {data: {data}} = await getPayment(paymentId);
    attempts++;

    if (validate(data)) {
      return resolve(data);
    } else if (data.status === 'failed') {
      return reject({err: new Error('Payment failed'), payment: data});
    } else {
      return setTimeout(executePoll, interval * 2, resolve, reject);
    }
  };

  return new Promise(executePoll);
}

export interface IPaymentResp {
  id: string,
  type: string,
  source: {id: string, type: string},
  amount: {amount: string, currency: string},
  status: string,
  refunds: string[],
  createDate: string,
  updateDate: string,
}

export const pollPaymentStatus = async (paymentData: IPaymentResp, proposerId: string, proposalId: string) : Promise<any> => (
	polling({
      validate: (payment) => payment.status === 'confirmed',
      interval: 10000,
      paymentId: paymentData.id
    })
      .then(async (payment) => {
        return await updateStatus(payment, 'confirmed');
      })
      .catch(async ({err,payment}) => {
          console.error('Polling error', err);
        // we are creating an event, but not using the error message from circle (e.g. card_invalid)
        await createEvent({
          userId: proposerId,
          objectId: proposalId,
          type: EVENT_TYPES.PAYMENT_FAILED
        })
        return await updateStatus(payment, 'failed'); //@question perhaps send circle error status as the status for db?
      })
);

const updateStatus = async(payment, status) => {
  const currentPayment = await Utils.getPaymentById(payment.id);
  currentPayment.status = status;
  currentPayment.fee = payment.fees
    ? Number(payment.fees.amount) * 100
    : 0;
  updatePayment(payment.id, currentPayment);
}

export const updatePayment = async (paymentId: string, doc: DocumentData) : Promise<any> => (
  await db.collection(Collections.Payments)
    .doc(paymentId)
    .set(
        doc,
        {
            merge: true
        }
    )
)

export default {
  updatePayment,
  pollPaymentStatus
}
