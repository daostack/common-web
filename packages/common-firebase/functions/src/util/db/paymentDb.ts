import { db } from '../../settings';
import { getPayment } from '../../circlepay/circlepay';
import { Utils } from '../util';
import { EVENT_TYPES } from '../../event/event';
import { createEvent } from './eventDbService';
import { Collections } from '../../constants';
import { DocumentData } from '@google-cloud/firestore';
import firebase from 'firebase';
import { IPaymentEntity } from '../types';
import { commonDb } from '../../common/database';
import { getProposalById } from './proposalDbService';
import { addCommonMemberByProposalId } from '../../common/business/addCommonMember';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

const polling = async ({validate, interval, paymentId}): Promise<any> => {
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
};

export interface IPaymentResp {
  id: string,
  type: string,
  source: { id: string, type: string },
  amount: { amount: string, currency: string },
  status: string,
  refunds: string[],
  createDate: string,
  updateDate: string,
}

export const pollPaymentStatus = async (paymentData: IPaymentResp, proposerId: string, proposalId: string): Promise<any> => (
  polling({
    validate: (payment) => payment.status === 'confirmed',
    interval: 10000,
    paymentId: paymentData.id
  })
    .then(async (payment) => {
      // Don't think that this should be here and is causing conflicts
      await addNewMemberToCommon(proposalId);
      return await updateStatus(payment, 'confirmed');
    })
    .catch(async ({err, payment}) => {
      console.error('Polling error', err);
      // we are creating an event, but not using the error message from circle (e.g. card_invalid)
      await createEvent({
        userId: proposerId,
        objectId: proposalId,
        type: EVENT_TYPES.PAYMENT_FAILED
      });
      return await updateStatus(payment, 'failed'); //@question perhaps send circle error status as the status for db?
    })
);

const updateStatus = async (payment, status) => {
  const currentPayment = await Utils.getPaymentById(payment.id);
  currentPayment.status = status;
  currentPayment.fee = payment.fees
    ? Number(payment.fees.amount) * 100
    : 0;
  updatePayment(payment.id, currentPayment);
};

export const updatePayment = async (paymentId: string, doc: DocumentData): Promise<any> => (
  await db.collection(Collections.Payments)
    .doc(paymentId)
    .set(
      doc,
      {
        merge: true
      }
    )
);

const addNewMemberToCommon = async (proposalId) => {    
   const proposal = (await getProposalById(proposalId)).data();    
   const common = await commonDb.getCommon(proposal.commonId);    
   // Update common funding info    
   common.raised += proposal.join.funding;    
   common.balance += proposal.join.funding;    

    await commonDb.updateCommon(common);    
   // Add member to the common    
   await addCommonMemberByProposalId(proposalId);    

    // Everything went fine so it is event time    
   await createEvent({    
     userId: proposal.proposerId,    
     objectId: proposal.id,    
     type: EVENT_TYPES.REQUEST_TO_JOIN_EXECUTED    
   });    
 }

export const getPaymentSnapshot = async (paymentId: string): Promise<DocumentSnapshot<IPaymentEntity>> => (
  await db.collection(Collections.Payments)
    .doc(paymentId)
    .get() as unknown as DocumentSnapshot<IPaymentEntity>
);