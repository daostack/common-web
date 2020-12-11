import { v4 } from 'uuid';
import admin from 'firebase-admin';
import Timestamp = admin.firestore.Timestamp;

import { CommonError } from '../../util/errors';
import { IProposalEntity } from '../../proposals/proposalTypes';
import { ISubscriptionEntity } from '../types';
import { commonDb } from '../../common/database';
import { subscriptionDb } from '../database';
import { createEvent } from '../../util/db/eventDbService';
import { EVENT_TYPES } from '../../event/event';
import { createSubscriptionPayment } from '../../circlepay/payments/business/createSubscriptionPayment';
import { isFinalized, isSuccessful } from '../../circlepay/payments/helpers';
import { addCommonMemberByProposalId } from '../../common/business/addCommonMember';
import { cardDb } from '../../circlepay/cards/database';


/**
 * Creates subscription based on proposal
 *
 * @param proposal - The proposal for which we want to create the subscription
 *
 * @throws { CommonError } - If the proposal is not provided
 * @throws { CommonError } - If the card, assigned to the proposal, is not found
 */
export const createSubscription = async (proposal: IProposalEntity): Promise<ISubscriptionEntity> => {
  if (!proposal || !proposal.id) {
    throw new CommonError('Cannot create subscription without proposal');
  }

  if (proposal.type !== 'join') {
    throw new CommonError('Cannot create subscription for proposals that are not join proposals', {
      proposal
    });
  }


  // Check if there is already subscription created for the common
  if (await subscriptionDb.exists({ proposalId: proposal.id })) {
    throw new CommonError('There is already created subscription for this proposal', {
      proposal
    });
  }

  // Acquire the required data
  const card = await cardDb.get(proposal.join.cardId);
  const common = await commonDb.getCommon(proposal.commonId);

  // Save the created subscription
  const subscription: ISubscriptionEntity = await subscriptionDb.add({
    charges: 0,
    lastChargedAt: undefined,

    proposalId: proposal.id,
    userId: proposal.proposerId,
    cardId: card.id,

    // Using Date().getDate() to ignore the time
    dueDate: Timestamp.now(),

    amount: proposal.join.funding,

    status: 'Active',
    revoked: false,

    metadata: {
      common: {
        id: common.id,
        name: common.name
      }
    }
  });

  // Subscription is created so broadcast that
  await createEvent({
    userId: subscription.userId,
    objectId: subscription.id,
    type: EVENT_TYPES.SUBSCRIPTION_CREATED
  });

  // Charge the subscription for the initial payment
  const payment = await createSubscriptionPayment({
    subscriptionId: subscription.id,
    sessionId: v4(),
    ipAddress: '127.0.0.1'
  });

  if(isSuccessful(payment)) {
    // Add the member to the common
    await addCommonMemberByProposalId(proposal.id);
  } else if (!isFinalized(payment)){
    // Delete the subscription
    // await subscriptionDb.delete(subscription.id);
    logger.warn('Initial subscription payment for subscription failed!', { subscription, payment })
  }

  return subscription;
};
