import { IPaymentEntity } from '../types';
import { ICirclePayment } from '../../types';
import { failureHelper, feesHelper } from '../helpers';
import { paymentDb } from '../database';
import { CommonError } from '../../../util/errors';

/**
 * Handles update from circle and saves it to the database
 *
 * @param payment - the current version of the payment from our FireStore
 * @param circlePayment - the current version of the payment as is from Circle
 */
export const updatePayment = async (payment: IPaymentEntity, circlePayment: ICirclePayment): Promise<IPaymentEntity> => {
  let updatedPayment: IPaymentEntity = payment;

  switch (circlePayment.data.status) {
    case 'failed':
      updatedPayment = {
        ...payment,

        status: circlePayment.data.status,
        failure: failureHelper.processFailedPayment(circlePayment)
      };

      break;
    case 'confirmed':
    case 'paid':
      updatedPayment = {
        ...payment,

        status: circlePayment.data.status,
        fees: feesHelper.processCircleFee(circlePayment)
      };

      break;
    default:
      logger.warn('Unknown payment state occurred. Not knowing how to handle the payment update', {
        payment,
        circlePayment: circlePayment.data,
        unknownStatus: circlePayment.data.status
      });

      break;
  }

  updatedPayment = await paymentDb.update(updatedPayment);

  // If the status has change broadcast an event
  if (payment.status !== updatedPayment.status) {
    // Create the payment updated event
    switch (updatedPayment.status) {
      case 'failed':
      case 'confirmed':
      case 'paid':
      case 'pending':
        // @todo Implement the payment status changed events
        // logger.error('NotImplementedError: Payment status changes events');

        break;
      default:
        throw new CommonError(`The payment status has updated, but is not known.`, {
          payment: updatedPayment
        });
    }

    // @todo If this is subscription payment handle subscription update
    // @todo If this is proposal payment handle the proposal update
  }

  return updatedPayment;
};