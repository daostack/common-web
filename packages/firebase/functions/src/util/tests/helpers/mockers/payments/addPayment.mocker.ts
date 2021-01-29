import firebase from 'firebase';

import { IPaymentEntity } from '../../../../../circlepay/payments/types';
import Timestamp = firebase.firestore.Timestamp;

jest.mock('../../../../../circlepay/payments/database/addPayment', () => ({
  addPayment: jest.fn()
    .mockImplementation((payment: IPaymentEntity): Promise<IPaymentEntity> => Promise.resolve({
      ...payment,
      id: 'ae6b689c-5dcb-41ed-84a7-51e6ce7faa76',

      createdAt: Timestamp.fromDate(new Date('December 17, 2020 03:24:03')),
      updatedAt: Timestamp.fromDate(new Date('December 17, 2020 05:34:43')),

      fees: {
        amount: 0,
        currency: 'USD'
      }
    }))
}));
