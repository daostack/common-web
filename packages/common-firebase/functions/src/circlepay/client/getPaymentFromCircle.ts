import axios from 'axios';

import { externalRequestExecutor } from '../../util';
import { circlePayApi } from '../../settings';
import { ErrorCodes } from '../../constants';

import { getCircleHeaders } from '../index';
import { ICirclePayment } from '../types';

/**
 * Gets the current state of the payment from Circle
 *
 * @param paymentId - the Circle payment ID (not the local one)
 */
export const getPaymentFromCircle = async (paymentId: string): Promise<ICirclePayment> => {
  const headers = await getCircleHeaders();

  return externalRequestExecutor<ICirclePayment>(async () => {
    return (await axios.get<ICirclePayment>(`${circlePayApi}/payments/${paymentId}`, headers)).data;
  }, {
    errorCode: ErrorCodes.CirclePayError,
    message: `Circle call to GET payment with id ${paymentId} failed`
  });
};

