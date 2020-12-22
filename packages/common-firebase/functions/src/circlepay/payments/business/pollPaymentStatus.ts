import axios from 'axios';

import { externalRequestExecutor, poll } from '../../../util';
import { ArgumentError, CommonError } from '../../../util/errors';
import { createEvent } from '../../../util/db/eventDbService';
import { EVENT_TYPES } from '../../../event/event';
import { circlePayApi } from '../../../settings';
import { ErrorCodes } from '../../../constants';

import { getCircleHeaders } from '../../index';
import { ICirclePayment } from '../../types';
import { IPaymentEntity } from '../types';
import { paymentDb } from '../database';
import { feesHelper } from '../helpers';

interface IPollPaymentOptions {
  interval?: number;
  maxRetries?: number;

  /**
   * Whether an error will be throw if the payment is finalized, but
   * the status is failed
   */
  throwOnPaymentFailed?: boolean;

  /**
   * The states the we want to reach. If any one of them is met
   * the polling will be terminated. *Default is: ['confirmed', 'failed', 'paid']*
   */
  desiredStatus?: string[];
}

const defaultPaymentOptions: IPollPaymentOptions = {
  interval: 60,
  maxRetries: 32,
  throwOnPaymentFailed: false,
  desiredStatus: ['confirmed', 'failed', 'paid']
};

/**
 * Polls payment until the payment reaches desired state
 *
 * @param payment
 * @param pollPaymentOptions
 */
export const pollPaymentStatus = async (payment: IPaymentEntity, pollPaymentOptions?: IPollPaymentOptions): Promise<IPaymentEntity> => {
  if (!payment) {
    throw new ArgumentError('payment', payment);
  }

  const headers = await getCircleHeaders();
  const options = {
    ...defaultPaymentOptions,
    ...pollPaymentOptions
  };

  const pollFn = async (): Promise<ICirclePayment> => {
    return externalRequestExecutor<ICirclePayment>(async () => {
      return (await axios.get<ICirclePayment>(`${circlePayApi}/payments/${payment.circlePaymentId}`, headers)).data;
    }, {
      errorCode: ErrorCodes.CirclePayError,
      message: 'Polling circle call failed'
    });
  };

  const validateFn = (payment: ICirclePayment): boolean => {
    return options.desiredStatus.some(s => s === payment.data.status);
  };

  const paymentObj = await poll<ICirclePayment>(pollFn, validateFn, options.interval, options.maxRetries);

  // Update payment
  payment = await paymentDb.update({
    ...payment,

    status: paymentObj.data.status,
    fees: feesHelper.processCircleFee(paymentObj)
  });

  if (options.throwOnPaymentFailed && payment.status === 'failed') {
    await createEvent({
      type: EVENT_TYPES.PAYMENT_FAILED,
      objectId: payment.id,
      userId: payment.userId
    });

    throw new CommonError('Payment failed');
  }

  // Return the updated payment
  return payment;
};