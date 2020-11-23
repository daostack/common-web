import * as functions from 'firebase-functions';
import { Collections } from '../../constants';
import { IEventEntity } from '../../event/type';
import { EVENT_TYPES } from '../../event/event';
import { fundProposal } from '../business/fundProposal';
import { createPayment } from '../../circlepay/createPayment';
import { CommonError } from '../../util/errors';
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

        // Create payment
        const proposal = await proposalDb.getProposal(event.objectId);

        if (proposal.type !== 'join') {
          throw new CommonError(`Cannot process REQUEST_TO_JOIN_ACCEPTED because the associated object (${event.objectId}) is not a join proposal`);
        }

        await createPayment({
          ipAddress: '127.0.0.1',
          proposalId: proposal.id,
          proposerId: proposal.proposerId,
          funding: proposal.join.funding,
          sessionId: context.eventId
        });

        if(proposal.join.fundingType === 'monthly') {
          // @todo Create subscription
        }
      }
    }
  );
