import * as functions from 'firebase-functions';
import { Collections } from '../../constants';
import { IEventEntity } from '../../event/type';
import { EVENT_TYPES } from '../../event/event';
import { fundProposal } from '../business/fundProposal';
import { createSubscription } from '../../subscriptions/business';
import { addCommonMemberByProposalId } from '../../common/business/addCommonMember';
import { createPayment } from '../../circlepay/createPayment';
import { commonDb } from '../../common/database';
import { proposalDb } from '../database';
import { createEvent } from '../../util/db/eventDbService';


export const onProposalApproved = functions.firestore
  .document(`/${Collections.Event}/{id}`)
  .onCreate(async (eventSnap, context) => {
      const event = eventSnap.data() as IEventEntity;

      if (event.type === EVENT_TYPES.FUNDING_REQUEST_ACCEPTED) {
        console.info('Funding request was approved. Crunching some numbers');

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
        console.info('Join request was approved. Adding new members to common');

        const proposal = await proposalDb.getJoinRequest(event.objectId);
        
        // If the proposal is monthly create subscription. Otherwise charge
        if (proposal.join.fundingType === 'monthly') {
          await createSubscription(proposal);
        } else {
          // @todo Rework this (and extract it, this is way too much logic for event listener)
          await createPayment({
            ipAddress: '127.0.0.1',
            proposalId: proposal.id,
            proposerId: proposal.proposerId,
            funding: proposal.join.funding,
            sessionId: context.eventId
          });

          // Update common funding info
          const common = await commonDb.getCommon(proposal.commonId);

          common.raised += proposal.join.funding;
          common.balance += proposal.join.funding;

          await commonDb.updateCommon(common);
        }

        // Add member to the common
        await addCommonMemberByProposalId(proposal.id);
      }
    }
  );
