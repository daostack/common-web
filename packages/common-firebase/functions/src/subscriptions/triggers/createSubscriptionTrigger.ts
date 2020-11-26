import * as functions from 'firebase-functions';

import { EVENT_TYPES } from '../../event/event';
import { IEventModel } from '../../event';
import { createSubscription } from '../business';
import { IJoinRequestProposal } from '../../proposals/proposalTypes';
import { proposalDb } from '../../proposals/database';
import { Collections } from '../../constants';

/**
 * This trigger is executed on all proposal approval and is used
 * to create subscription for the approved proposals in commons, that
 * use monthly payments
 */
export const createSubscriptionsTrigger = functions.firestore
  .document(`/${Collections.Event}/{id}`)
  .onCreate(async (snap) => {
    const event = snap.data() as IEventModel;

    if (event.type === EVENT_TYPES.REQUEST_TO_JOIN_ACCEPTED) {
      const proposal = await proposalDb.getJoinRequest(event.objectId);

      if ((proposal as IJoinRequestProposal).join.fundingType === 'monthly') {
        await createSubscription(proposal);
      }
    }
  });