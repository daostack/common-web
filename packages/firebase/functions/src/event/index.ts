import { IEventModel } from '@common/types';
import * as functions from 'firebase-functions';
import { notifyData } from '../notification/notification'
import { createNotification } from '../util/db/notificationDbService';
import { eventData, EVENT_TYPES } from './event'
import { proposalDb } from '../proposals/database';

/**
 * COMMON_MEMBER_ADDED contains the common data and not the requestToJoin, so we
 * need to extract it fro, the common and use its id for the notification object
 * @param objectId of the event
 */
const addMemberNotification = async (event): Promise<string> => {
   
   if (event.type === EVENT_TYPES.COMMON_MEMBER_ADDED) {
     // using getMany, but actually there will only be one join request from that user to this common
      const requestToJoinArr = await proposalDb.getMany({
        commonId: event.objectId,
        proposerId: event.userId,
        type: 'join',
      })
     return requestToJoinArr[0].id;
    }
    return event.objectId;
}

const processEvent = async (event: IEventModel): Promise<void> => {
  // Create Notification object based on event
  if (event.type in notifyData) {
    
    const objectId = await addMemberNotification(event);
    
    if (objectId) {
      const currNotifyObj = eventData[event.type];
      const currEventObject = await currNotifyObj.eventObject(objectId);
      const userFilter = await currNotifyObj.notifyUserFilter(currEventObject);

      await createNotification({
        eventId: event.id,
        eventType: event.type,
        eventObjectId: objectId,
        userFilter,
        createdAt: new Date(),
      });
    }
  }
}

exports.commonEventListeners = functions
  .firestore
  .document('/event/{id}')
  .onCreate(async (snap) => {
    await processEvent(snap.data() as IEventModel)
  })