import * as functions from 'firebase-functions';
import { Collections } from '../../../constants';
import { IEventEntity } from '../../../event/type';
import { EVENT_TYPES } from '../../../event/event';
import { onPayoutCreated } from './onPayoutCreated';
import { onPayoutApproved } from './onPayoutApproved';

export const payoutTriggers = functions.firestore
  .document(`/${Collections.Event}/{id}`)
  .onCreate(async (snap, context) => {
    const eventObj = snap.data() as IEventEntity;

    switch (eventObj.type) {
      case EVENT_TYPES.PAYOUT_CREATED:
        await onPayoutCreated(eventObj, context);

        break;

      case EVENT_TYPES.PAYOUT_APPROVED:
        await onPayoutApproved(eventObj, context);

        break;

      default:
        break;
    }
  });