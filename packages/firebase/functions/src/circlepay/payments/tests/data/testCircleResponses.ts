import { ICircleCreatePaymentResponse, ICirclePayment } from '../../../types';

export const getPaymentPendingResponce: ICirclePayment = {
  data: {
    id: 'b3025713-7988-45e5-8af8-cca8d624ce28',
    type: 'payment',
    merchantId: 'fd8417cb-34c0-4a56-9d52-d4245c02cd38',
    merchantWalletId: '1000032538',
    source: { id: '7a8430b7-d7b7-41d1-872b-48e444ea42a4', type: 'card' },
    description: 'Merchant Payment',
    amount: { amount: '369.00', currency: 'USD' },
    fees: { amount: '15.98', currency: 'USD' },
    status: 'pending',
    verification: { cvv: 'pass', avs: 'Y' },
    trackingRef: '93470014896091928081699',
    refunds: [],
    createDate: '2020-12-31T08:45:58.796Z',
    updateDate: '2020-12-31T08:55:17.207Z',
    metadata: { email: 'yanivitzhaki0@gmail.com' }
  }
};

export const getPaymentSuccessfulResponce: ICirclePayment = {
  data: {
    id: 'b3025713-7988-45e5-8af8-cca8d624ce28',
    type: 'payment',
    merchantId: 'fd8417cb-34c0-4a56-9d52-d4245c02cd38',
    merchantWalletId: '1000032538',
    source: { id: '7a8430b7-d7b7-41d1-872b-48e444ea42a4', type: 'card' },
    description: 'Merchant Payment',
    amount: { amount: '369.00', currency: 'USD' },
    fees: { amount: '15.98', currency: 'USD' },
    status: 'paid',
    verification: { cvv: 'pass', avs: 'Y' },
    trackingRef: '93470014896091928081699',
    refunds: [],
    createDate: '2020-12-31T08:45:58.796Z',
    updateDate: '2020-12-31T08:55:17.207Z',
    metadata: { email: 'yanivitzhaki0@gmail.com' }
  }
};

export const getPaymentFailedResponse: ICirclePayment = {
  data: {
    fees: undefined,
    id: '9036e624-f110-4203-9a07-30688c3dec21',
    type: 'payment',
    merchantId: 'fd8417cb-34c0-4a56-9d52-d4245c02cd38',
    merchantWalletId: '1000032538',
    source: { id: 'fcca39d1-bcdc-4f3d-813d-1108b8e11ee4', type: 'card' },
    description: 'Merchant Payment',
    amount: { amount: '5.01', currency: 'USD' },
    status: 'failed',
    verification: { cvv: 'pass', avs: 'D' },
    errorCode: 'payment_failed',
    refunds: [],
    createDate: '2020-12-16T07:50:32.328Z',
    updateDate: '2020-12-16T07:50:32.918Z',
    metadata: { email: 'yanivitzhaki0@gmail.com' }
  }
};

export const createPaymentValidResponse: ICircleCreatePaymentResponse = {
  data: {
    fees: undefined,
    id: '62d74450-9b61-4d5a-8890-4fb22eb09fd8',
    type: 'payment',
    merchantId: 'fd8417cb-34c0-4a56-9d52-d4245c02cd38',
    merchantWalletId: '1000032538',
    source: { id: '699ae390-fb25-43f4-9e66-e8581499f8c9', type: 'card' },
    description: 'Merchant Payment',
    amount: { amount: '120.00', currency: 'USD' },
    status: 'pending',
    refunds: [],
    createDate: '2021-01-26T06:51:33.702Z',
    updateDate: '2021-01-26T06:51:33.702Z',
    metadata: { email: 'alexander2001ivanov@gmail.com' }
  }
};

