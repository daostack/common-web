import axios from 'axios';

import { externalRequestExecutor, poll } from '../../../util';
import { CirclePaymentStatus } from '../../../util/types';
import { ArgumentError, CommonError } from '../../../util/errors';
import { circlePayApi } from '../../../settings';
import { createEvent } from '../../../util/db/eventDbService';
import { EVENT_TYPES } from '../../../event/event';
import { ErrorCodes } from '../../../constants';

import { ICirclePayment } from '../../types';
import { IPaymentEntity } from '../types';
import { paymentDb } from '../database';
import { getCircleHeaders } from '../../index';

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

  const pollFn = async (): Promise<CirclePaymentStatus> => {
    const response = await externalRequestExecutor<ICirclePayment>(async () => {
      return (await axios.get<ICirclePayment>(`${circlePayApi}/payments/${payment.circlePaymentId}`, headers)).data;
    }, {
      errorCode: ErrorCodes.CirclePayError,
      message: 'Polling circle call failed'
    });

    return response.data.status;
  };

  const validateFn = (status: CirclePaymentStatus): boolean => {
    return options.desiredStatus.some(s => s === status);
  };

  const status = await poll<CirclePaymentStatus>(pollFn, validateFn, options.interval, options.maxRetries);

  // Update payment
  payment = await paymentDb.update({
    ...payment,

    status
  });

  // Event
  await createEvent({
    type: status === 'failed'
      ? EVENT_TYPES.PAYMENT_FAILED
      : status === 'paid'
        ? EVENT_TYPES.PAYMENT_PAID
        : status === 'confirmed'
          ? EVENT_TYPES.PAYMENT_CONFIRMED
          : EVENT_TYPES.PAYMENT_UPDATED,
    objectId: payment.id,
    userId: payment.userId
  });

  if (options.throwOnPaymentFailed && payment.status === 'failed') {
    throw new CommonError('Payment failed');
  }

  // Return the updated payment
  return payment;
};