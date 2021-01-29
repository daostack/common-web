import { ICardEntity } from '../../types';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export const pendingCardEntity: ICardEntity = {
  id: 'ae6b689c-5dcb-41ed-84a7-51e6ce7faa76',
  ownerId: 'ae6b689c-5dcb-41ed-84a7-51e6ce7faa72',
  circleCardId: 'ae6b689c-5dcb-41ed-84a7-51e6ce7faa75',
  createdAt: Timestamp.fromDate(new Date('December 17, 2020 03:24:03')),
  updatedAt: Timestamp.fromDate(new Date('December 17, 2020 05:34:43')),
  metadata: {
    billingDetails: {
      city: 'Sofia',
      country: 'Bulgaria',
      line1: 'Nqkade v Sofia',
      line2: '',
      name: 'Alex Ivanov',
      postalCode: '1000'
    },
    digits: '0832',
    network: 'VISA'
  },
  verification: {
    cvv: 'pending'
  }
}