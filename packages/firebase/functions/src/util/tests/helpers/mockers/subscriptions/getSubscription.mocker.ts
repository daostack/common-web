import firebase from 'firebase';
import { ISubscriptionEntity } from '../../../../../subscriptions/types';
import { NotFoundError } from '../../../../errors';
import Timestamp = firebase.firestore.Timestamp;

jest.mock('../../../../../subscriptions/database/getSubscription', () => ({
  getSubscription: jest.fn()
    .mockImplementation(async (subscriptionId: string): Promise<ISubscriptionEntity> => {
      if (subscriptionId === '404' || subscriptionId === '00000000-0000-0000-0000-000000000000') {
        throw new NotFoundError(subscriptionId, 'subscription');
      }

      return {
        metadata: {
          common: { name: 'Miluiim', id: '20c97f59-d176-41a5-9cfa-1b31b017718f' }
        },
        amount: 1250,
        dueDate: Timestamp.fromDate(new Date('December 17, 2020 03:24:03')),
        revoked: false,
        userId: '97d5y9WXk1fEZv767j1ejKuHevi1',
        proposalId: '4dbf0f0f-e2e3-48ce-ae5e-81e783876617',
        lastChargedAt: Timestamp.fromDate(new Date('December 17, 2020 03:24:03')),
        createdAt: Timestamp.fromDate(new Date('December 17, 2020 03:24:03')),
        charges: 1,
        cardId: 'e8a2c186-b1b2-44dd-b36d-2af457125347',
        id: '175db9ee-31b5-48f5-b899-98945e6251b8',
        status: 'Active',
        updatedAt: Timestamp.fromDate(new Date('December 17, 2020 03:24:03'))
      };
    })
}));