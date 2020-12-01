import admin from 'firebase-admin';
import Timestamp = admin.firestore.Timestamp;

import { CommonError } from '../../util/errors';
import { createSubscriptionPayment } from '../../circlepay/createSubscriptionPayment';
import { IProposalEntity } from '../../proposals/proposalTypes';
import { ISubscriptionEntity } from '../types';
import { commonDb } from '../../common/database';
import { subscriptionDb } from '../database';
import { createEvent } from '../../util/db/eventDbService';
import { EVENT_TYPES } from '../../event/event';
import { getCardById } from '../../util/db/cardDb';


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

  const card = await getCardById(proposal.join.cardId);

  if (await subscriptionDb.exists({ proposalId: proposal.id })) {
    throw new CommonError('There is already created subscription for this proposal', {
      proposal
    });
  }
  const common = await commonDb.getCommon(proposal.commonId);

  // Save the created subscription
  const subscription: ISubscriptionEntity = await subscriptionDb.add({
    payments: [],
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
  await createSubscriptionPayment(subscription);

  return subscription;
};
