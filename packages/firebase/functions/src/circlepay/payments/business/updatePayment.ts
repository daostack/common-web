import { IPaymentEntity } from '@common/types';
import { ICirclePayment } from '../../types';
import { failureHelper, feesHelper, isSuccessful } from '../helpers';
import { paymentDb } from '../database';
import { proposalDb } from '../../../proposals/database';
import { subscriptionDb } from '../../../subscriptions/database';
import { handleFinalizedSubscriptionPayment } from './handlers/subscriptions/handleFinalizedSubscriptionPayment';
import { handleFinalizedJoinPayment } from './handlers/joins/handleFinalizedJoinPayment';
import { addCommonMemberByProposalId } from '../../../common/business/addCommonMember';
import { createEvent } from '../../../util/db/eventDbService';
import { EVENT_TYPES } from '../../../event/event';

/**
 * Handles update from circle and saves it to the database
 *
 * @param oldPayment - the current version of the payment from our FireStore
 * @param circlePayment - the current version of the payment as is from Circle
 */
export const updatePayment = async (oldPayment: IPaymentEntity, circlePayment: ICirclePayment): Promise<IPaymentEntity> => {
  let updatedPayment: IPaymentEntity = oldPayment;

  switch (circlePayment.data.status) {
    case 'failed':
      updatedPayment = {
        ...oldPayment,

        status: circlePayment.data.status,
        failure: failureHelper.processFailedPayment(circlePayment)
      };

      break;
    case 'confirmed':
    case 'paid':
      updatedPayment = {
        ...oldPayment,

        status: circlePayment.data.status,
        fees: feesHelper.processCircleFee(circlePayment)
      };

      break;
    default:
      logger.warn('Unknown payment state occurred. Not knowing how to handle the payment update', {
        payment: oldPayment,
        circlePayment: circlePayment.data,
        unknownStatus: circlePayment.data.status
      });

      break;
  }

  updatedPayment = await paymentDb.update(updatedPayment);

  // If the status has change broadcast an event
  if (oldPayment.status !== updatedPayment.status) {
    logger.debug('Payment status update occurred on payment', {
      status: `${oldPayment.status} -> ${updatedPayment.status}`,
      paymentType: oldPayment.type,
      paymentId: oldPayment.id
    }, {
      oldPayment: oldPayment,
      updatedPayment: updatedPayment
    });

    // Create the payment updated event
    // switch (updatedPayment.status) {
    //   case 'failed':
    //   case 'confirmed':
    //   case 'paid':
    //   case 'pending':
    //     break;
    //   default:
    //     throw new CommonError(`The payment status has updated, but is not known.`, {
    //       payment: updatedPayment
    //     });
    // }

    // If this is subscription payment handle subscription update
    if (oldPayment.type === 'subscription') {
      const subscription = await subscriptionDb.get(updatedPayment.subscriptionId);

      logger.info('Handling payment status change for subscription payment');

      // Handle this only if the previous status was explicitly pending
      if (oldPayment.status === 'pending') {

        // Do some grunt work if this is the first subscription payment
        if (!subscription.charges) {
          if (isSuccessful(updatedPayment)) {
            logger.notice('Stuck payment succeeded, but it was initial for subscription.', {
              payment: updatedPayment,
              subscription
            });

            // Add the member to the common
            await addCommonMemberByProposalId(subscription.proposalId);

            // Broadcast the event for the join proposal executed
            await createEvent({
              type: EVENT_TYPES.REQUEST_TO_JOIN_EXECUTED,
              userId: subscription.userId,
              objectId: subscription.proposalId
            });
          } else {
            logger.notice('Stuck payment failed, but it was initial for subscription.', {
              payment: updatedPayment,
              subscription
            });


            await subscriptionDb.delete(subscription.id);
          }
        }

        // status change to get to here
        // If we are here the payment is for sure not pending because we need
        await handleFinalizedSubscriptionPayment(subscription, updatedPayment);
      }
    }

    // If this is proposal payment handle the proposal update
    if (oldPayment.type === 'one-time') {
      const proposal = await proposalDb.getJoinRequest(updatedPayment.proposalId);

      logger.warn('Not Implemented Waring: Payment status change for subscription payment');

      // Handle this only if the previous status was explicitly pending
      if (oldPayment.status === 'pending') {
        await handleFinalizedJoinPayment(proposal, updatedPayment);
      }
    }
  }

  return updatedPayment;
};