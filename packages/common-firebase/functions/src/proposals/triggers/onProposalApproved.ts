import * as functions from 'firebase-functions';
import { Collections } from '../../constants';
import { IEventEntity } from '../../event/type';
import { EVENT_TYPES } from '../../event/event';
import { proposalDb } from '../database';
import { addCommonMemberByProposalId } from '../../common/business/addCommonMember';


exports.watchForExecutedProposals = functions.firestore
  .document(`/${Collections.Event}/{id}`)
  .onCreate(async (eventSnap) => {
      const event = eventSnap.data() as IEventEntity;

      if(event.type === EVENT_TYPES.APPROVED_FUNDING_REQUEST) {
        console.info('Funding request was approved. Crunching some numbers');

        // @todo Change the common balance
      }

      if(event.type === EVENT_TYPES.APPROVED_JOIN_REQUEST) {
        console.info('Join request was approved. Adding new members to common');

        // @todo Create payment

        await addCommonMemberByProposalId(event.objectId);
      }
    }
  );