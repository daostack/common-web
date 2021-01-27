import { IPaymentEntity } from '../../types';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export const pendingPaymentEntity: IPaymentEntity = {
  createdAt: Timestamp.fromDate(new Date('December 17, 2020 03:24:03')),
  updatedAt: Timestamp.fromDate(new Date('December 17, 2020 05:34:43')),
  amount: { amount: 36900, currency: 'USD' },
  fees: { amount: 1598, currency: 'USD' },
  source: { type: 'card', id: '62e367b3-6e16-44d8-9407-d5f9486924f4' },
  type: 'subscription',
  circlePaymentId: 'b3025713-7988-45e5-8af8-cca8d624ce28',
  userId: '2Ti3LkP23KUJVp2AZY3wVHYWRxm2',
  proposalId: '706da88a-a417-464d-8d36-3d68fb2b954c',
  id: '0ef989c3-d096-42c1-b525-66a3719e413a',
  subscriptionId: '811dd5ed-1481-43bc-bc79-cacf6598916f',
  status: 'pending'
};

export const successfulPaymentEntity: IPaymentEntity = {
  createdAt: Timestamp.fromDate(new Date('December 17, 2020 03:24:03')),
  updatedAt: Timestamp.fromDate(new Date('December 17, 2020 05:34:43')),
  amount: { amount: 36900, currency: 'USD' },
  fees: { amount: 1598, currency: 'USD' },
  source: { type: 'card', id: '62e367b3-6e16-44d8-9407-d5f9486924f4' },
  type: 'subscription',
  circlePaymentId: 'b3025713-7988-45e5-8af8-cca8d624ce28',
  userId: '2Ti3LkP23KUJVp2AZY3wVHYWRxm2',
  proposalId: '706da88a-a417-464d-8d36-3d68fb2b954c',
  id: '0ef989c3-d096-42c1-b525-66a3719e413a',
  subscriptionId: '811dd5ed-1481-43bc-bc79-cacf6598916f',
  status: 'paid'
};


export const failedPaymentEntity: IPaymentEntity = {
  fees: undefined,
  amount: { amount: 501, currency: 'USD' },
  source: { type: 'card', id: '25533db6-4fd5-4606-b477-90e885f1a7e5' },
  createdAt: Timestamp.fromDate(new Date('December 17, 2020 03:24:03')),
  updatedAt: Timestamp.fromDate(new Date('December 17, 2020 05:34:43')),
  type: 'subscription',
  userId: '2Ti3LkP23KUJVp2AZY3wVHYWRxm2',
  circlePaymentId: '9036e624-f110-4203-9a07-30688c3dec21',
  proposalId: '946200c6-bc12-42a5-ad82-0fad4b0befec',
  failure: {
    errorDescription: 'Payment failed due to unspecified error',
    errorCode: 'payment_failed'
  },
  id: '133439ba-815d-4aa6-93ee-c9c3c06b1c36',
  subscriptionId: 'efa5c317-aed8-4366-9c1f-078a4479c283',
  status: 'failed'
};
