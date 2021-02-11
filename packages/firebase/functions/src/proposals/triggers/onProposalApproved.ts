import * as functions from 'firebase-functions';
import { createProposalPayment } from '../../circlepay/payments/business/createProposalPayment';
import { addCommonMemberByProposalId } from '../../common/business/addCommonMember';

import { Collections } from '../../constants';
import { EVENT_TYPES } from '../../event/event';
import { IEventEntity } from '../../event/types';
import { createSubscription } from '../../subscriptions/business';
import { createEvent } from '../../util/db/eventDbService';
import { fundProposal } from '../business/fundProposal';
import { proposalDb } from '../database';

export const onProposalApproved = functions.firestore
  .document(`/${Collections.Events}/{id}`)
  .onCreate(async (eventSnap, context) => {
    const event = eventSnap.data() as IEventEntity;

    if (event.type === EVENT_TYPES.FUNDING_REQUEST_ACCEPTED) {
      logger.info('Funding request was approved. Crunching some numbers');

      await fundProposal(event.objectId);

      // Everything went fine so it is event time
      await createEvent({
        userId: event.userId,
        objectId: event.objectId,
        type: EVENT_TYPES.FUNDING_REQUEST_EXECUTED
      });
    }

    // @refactor
    if (event.type === EVENT_TYPES.REQUEST_TO_JOIN_ACCEPTED) {
      logger.info('Join request was approved. Starting to process payment');

      const proposal = await proposalDb.getJoinRequest(event.objectId);

      // If the proposal is monthly create subscription. Otherwise charge
      if (proposal.join.fundingType === 'monthly') {
        await createSubscription(proposal);
      } else {
        if (proposal.join.funding > 0) {
          // Create the payment
          await createProposalPayment({
            proposalId: proposal.id,
            sessionId: context.eventId
          }, { throwOnFailure: true });
        } else {
          // Add the user as member
          await addCommonMemberByProposalId(proposal.id);
        }
      }
    }
  });
