import { ISubscriptionEntity } from '@common/types';

import { EVENT_TYPES } from '../../../../../event/event';
import { createEvent } from '../../../../../util/db/eventDbService';
import { isFinalized, isPending, isSuccessful } from '../../../helpers';
import { IPaymentEntity } from '../../../types';
import { handleFailedSubscriptionPayment } from './handleFailedSubscriptionPayment';
import { handleSuccessfulSubscriptionPayment } from './handleSuccesfulSubscriptionPayment';

/**
 * Processes the payment, made for subscription, after it has been finalized
 *
 * @param subscription - The subscription, for which the payment was mad
 * @param payment - The payment itself
 */
export const handleFinalizedSubscriptionPayment = async (subscription: ISubscriptionEntity, payment: IPaymentEntity): Promise<void> => {
  if (isPending(payment)) {
    logger.error('Non finalized payment passed to `handleFinalizedSubscriptionPayment()`', {
      payment
    });

    return;
  }

  if (isSuccessful(payment)) {
    await handleSuccessfulSubscriptionPayment(subscription, payment);
  } else if (isFinalized(payment)) {
    await createEvent({
      type: EVENT_TYPES.SUBSCRIPTION_PAYMENT_FAILED,
      objectId: payment.id,
      userId: payment.userId
    });

    await handleFailedSubscriptionPayment(subscription, payment);
  } else {
    await createEvent({
      type: EVENT_TYPES.SUBSCRIPTION_PAYMENT_STUCK,
      objectId: payment.id,
      userId: payment.userId
    });

    logger.warn('Payment is not in finalized or successful state after polling', { payment });
  }
};