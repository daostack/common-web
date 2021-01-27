import { ICircleCreateCardResponse } from '../../../types';
import { IGetCircleCardResponse } from '../../../client/getCardFromCircle';

export const createCardSuccessfulRequest: ICircleCreateCardResponse = {
  data: {
    id: 'f5e63e52-c488-4699-b48a-c5c8f39b9005',
    last4: '0006',
    billingDetails: {
      name: 'Tester Tester Tester Tester',
      line1: '221B Baker Street',
      city: 'Metropolis',
      postalCode: '31415PI',
      district: 'TX',
      country: 'US'
    },
    expMonth: 11,
    expYear: 2024,
    network: 'VISA',
    fingerprint: '72bcf942-f742-413c-baaf-345abff90019',
    verification: { 'cvv': 'pending', 'avs': 'pending' },
    metadata: { 'email': 'alexander2001ivanov@gmail.com' },
    createDate: new Date(),
    updateDate: new Date()
  }
};

export const getCardSuccessfulChecks: IGetCircleCardResponse = {
  data: {
    id: 'f3d6adc1-9b43-40f8-baf0-3a831ac6799b',
    last4: '0006',
    billingDetails: {
      name: 'Tester Tester Tester Tester',
      line1: '221B Baker Street',
      city: 'Metropolis',
      postalCode: '31415PI',
      district: 'TX',
      country: 'US'
    },
    expMonth: 11,
    expYear: 2024,
    network: 'VISA',
    fingerprint: '72bcf942-f742-413c-baaf-345abff90019',
    verification: {
      cvv: 'pass',
      avs: 'Y'
    },
    createDate: new Date(),
    metadata: {
      email: 'alexander2001ivanov@gmail.com'
    },
    updateDate: new Date()
  }
};

export const getCardPendingChecks: IGetCircleCardResponse = {
  data: {
    id: 'f3d6adc1-9b43-40f8-baf0-3a831ac6799b',
    last4: '0006',
    billingDetails: {
      name: 'Tester Tester Tester Tester',
      line1: '221B Baker Street',
      city: 'Metropolis',
      postalCode: '31415PI',
      district: 'TX',
      country: 'US'
    },
    expMonth: 11,
    expYear: 2024,
    network: 'VISA',
    fingerprint: '72bcf942-f742-413c-baaf-345abff90019',
    verification: {
      cvv: 'pending',
      avs: 'pending'
    },
    createDate: new Date(),
    metadata: {
      email: 'alexander2001ivanov@gmail.com'
    },
    updateDate: new Date()
  }
};

export const getCardFailedCvvCheck: IGetCircleCardResponse = {
  data: {
    id: 'a79b747d-31d4-4770-b6c9-633635e246d9',
    last4: '0006',
    billingDetails: {
      name: 'Thor Odinson',
      line1: '221B Baker Street',
      city: 'Metropolis',
      postalCode: '31415PI',
      district: 'TX',
      country: 'US'
    },
    expMonth: 1,
    expYear: 2021,
    network: 'VISA',
    fingerprint: '72bcf942-f742-413c-baaf-345abff90019',
    errorCode: 'card_cvv_invalid',
    verification: { cvv: 'fail', avs: 'D' },
    createDate: new Date(),
    metadata: { email: 'alexander.ivanov@limechain.tech' },
    updateDate: new Date()
  }
};

