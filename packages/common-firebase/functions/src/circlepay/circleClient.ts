import axios from 'axios';

import { ErrorCodes } from '../constants';
import { circlePayApi } from '../settings';
import { externalRequestExecutor } from '../util';

import { ICirclePayment } from './types';
import { getCircleHeaders } from './index';

/**
 * Gets the current state of the payment from Circle
 *
 * @param paymentId - the Circle payment ID (not the local one)
 */
const getPaymentFromCircle = async (paymentId: string): Promise<ICirclePayment> => {
  const headers = await getCircleHeaders();

  return externalRequestExecutor<ICirclePayment>(async () => {
    return (await axios.get<ICirclePayment>(`${circlePayApi}/payments/${paymentId}`, headers)).data;
  }, {
    errorCode: ErrorCodes.CirclePayError,
    message: 'Polling circle call failed'
  });
};

export const circleClient = {
  getPayment: getPaymentFromCircle
}