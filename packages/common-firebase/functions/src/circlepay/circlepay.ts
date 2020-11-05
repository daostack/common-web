import axios from 'axios';


import { env } from '../constants';
import { circlePayApi } from '../settings';
import { externalRequestExecutor } from '../util';
import { ErrorCodes } from '../util/constants';

const options = {
	headers: {
		accept: 'application/json',
		'Content-Type': 'application/json',
		authorization: `Bearer ${env.circlepay.apiKey}`
	},
};

export interface ICardData {
	billingDetails: {
	name: string,
	city: string,
	country: string,
	line1: string,
	postalCode: string,
	district: string,
	},
  expMonth: number,
  expYear: number,
  metadata: {
    email: string,
    ipAddress: string,
    sessionId: string,
  },
  keyId: string,
  encryptedData: string,
  proposalId: string,
  idempotencyKey: string,
}

export const createCard = async (cardData: ICardData) : Promise<any> => {
  const response = await externalRequestExecutor(async () => {
    return await axios.post(`${circlePayApi}/cards`,
      cardData,
      options
    )
  }, {
    errorCode: ErrorCodes.CirclePayError,
    userMessage: 'Call to CirclePay failed. Please try again later and if the issue persist contact us.'
  });

	return response.data;
}

export const encryption = async () : Promise<any> => {
	// const response = await axios.get(`${circlePayApi}/encryption/public`, options);

  const response = await externalRequestExecutor(async () => {
    return await axios.get(`${circlePayApi}/encryption/public`, options);
  }, {
    errorCode: ErrorCodes.CirclePayError,
    userMessage: 'Call to CirclePay failed. Please try again later and if the issue persist contact us.'
  });

	return response.data;
}

interface IPayment {
  idempotencyKey: string,
  metadata: {
    email: string, 
    sessionId: string,
    ipAddress: string,
  },
  amount: {
    amount: string,
    currency: string,
  },
  verification: string,
  source: {
    id: string,
    type: string
  },
}

export const createAPayment = async (paymentData: IPayment) : Promise<any> => {
  return await externalRequestExecutor(async () => {
    return await axios.post(`${circlePayApi}/payments`,
      paymentData,
      options
    );
  }, {
    errorCode: ErrorCodes.CirclePayError,
    userMessage: 'Call to CirclePay failed. Please try again later and if the issue persist contact us.'
  });
}

export const getPayment = async(paymentId: string) : Promise<any> => {
  return await externalRequestExecutor(async () => {
    return await axios.get(`${circlePayApi}/payments/${paymentId}`, options)
  }, {
    errorCode: ErrorCodes.CirclePayError,
    userMessage: 'Call to CirclePay failed. Please try again later and if the issue persist contact us.'
  });
}






