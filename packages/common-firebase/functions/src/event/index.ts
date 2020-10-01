import * as functions from 'firebase-functions';
import { notifyData } from '../notification/notification'
import { createNotification } from '../db/notificationDbService';
import { eventData } from './event'


export interface IEventModel {
    id: string,
    objectId: string,
    type: string,
    createdAt: string,
}

const processEvent = async (event: IEventModel) => {
  
  // Create Notification object based on event
  if (event.type in notifyData) {
    const currNotifyObj = eventData[event.type];

    const currEventObject = await currNotifyObj.eventObject(event.objectId);
    const userFilter = await currNotifyObj.notifyUserFilter(currEventObject);

    await createNotification({
      eventId: event.id,
      eventType: event.type,
      eventObjectId: event.objectId,
      userFilter,
      createdAt: new Date(),
    });
  }   
}

exports.commonEventListener = functions
  .firestore
  .document('/event/{id}')
  .onCreate(async (snap) => {
    await processEvent(snap.data() as IEventModel)
  })