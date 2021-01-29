import admin from 'firebase-admin';
import moment from 'moment';

import { addMonth } from '../../../../../util';
import { ArgumentError, CommonError } from '../../../../../util/errors';

import { updateCommonBalance } from '../../../../../common/business/updateCommonBalance';
import { ISubscriptionEntity } from '../../../../../subscriptions/types';
import { subscriptionDb } from '../../../../../subscriptions/database';
import { proposalDb } from '../../../../../proposals/database';
import { IPaymentEntity } from '../../../types';
import { isSuccessful } from '../../../helpers';
import { createEvent } from '../../../../../util/db/eventDbService';
import { EVENT_TYPES } from '../../../../../event/event';
import Timestamp = admin.firestore.Timestamp;


/**
 * Clears the state of the subscription and updates the due date on payment success
 *
 * @param subscription - The subscription to update
 * @param payment - The successful payment
 *
 * @throws { CommonError } - If there is no subscription passed (or is null/undefined)
 * @throws { CommonError } - If the due date for the subscription is in the future
 */
export const handleSuccessfulSubscriptionPayment = async (subscription: ISubscriptionEntity, payment: IPaymentEntity): Promise<void> => {
  if (!subscription) {
    throw new CommonError(`
      Cannot handle successful payment without providing subscription object!
    `);
  }

  if (!payment) {
    throw new ArgumentError(`
      Cannot handle successful payment for subscription without the subscription
    `);
  }

  // Check if the payment has really succeeded
  if (!isSuccessful(payment)) {
    throw new CommonError('Cannot handle successful payment for payment that is not actually successful', {
      subscription,
      payment
    });
  }

  await createEvent({
    type: EVENT_TYPES.SUBSCRIPTION_PAYMENT_CONFIRMED,
    objectId: payment.id,
    userId: payment.userId
  });

  // The user may have canceled the subscription between the payment failure
  // so change this only if it explicitly set that the payment is failed
  if (subscription.status === 'PaymentFailed') {
    subscription.status = 'Active';
    subscription.paymentFailures = [];
  }

  // Update the date only if it is in the past (it should always be!)
  if (moment(subscription.dueDate.toDate()).isSameOrBefore(new Date(), 'day')) {
    subscription.dueDate = Timestamp.fromDate(addMonth(subscription.dueDate));
  } else {
    logger.error(
      `Trying to update due date that is in the future 
      for subscription with id (${subscription.id})! 
    `, {
        subscription
      });
  }

  // Update metadata about the subscription
  subscription.charges = (subscription.charges || 0) + 1;
  subscription.lastChargedAt = Timestamp.now();

  // Update the commons balance
  await updateCommonBalance(subscription.metadata.common.id, subscription.amount);

  // Save the updated data
  await Promise.all([
    subscriptionDb.update(subscription),
    proposalDb.update({
      id: subscription.proposalId,
      paymentState: 'confirmed'
    })
  ]);
};