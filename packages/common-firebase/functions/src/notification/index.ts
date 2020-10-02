import * as functions from 'firebase-functions';
import { getUserById } from '../db/userDbService';
import Notification from './notification';
import emailClient from '../email';
import { notifyData } from './notification';

export interface INotificationModel {
    userFilter: string[],
    createdAt: string,
    eventObjectId: string,
    eventType: string,
    eventId: string,
}

const processNotification = async (notification: INotificationModel) => {

    const currNotifyObj = notifyData[notification.eventType];

    if (!currNotifyObj.data) {
        throw Error(`Not found data method for notification on event type "${notification.eventType}".`);
    }
    
    if (notification.userFilter) {
        const eventNotifyData = await currNotifyObj.data(notification.eventObjectId);
        notification.userFilter.forEach( async filterUserId => {
            const userData: any = (await getUserById(filterUserId)).data();

            if (currNotifyObj.notification) {
                const {title, body, image} = await currNotifyObj.notification(eventNotifyData);
                await Notification.send(userData.tokens, title, body, image);
            }

            if (currNotifyObj.email) {
                const emailTemplate = currNotifyObj.email(eventNotifyData);
                emailTemplate.to = userData.email;
                await emailClient.sendTemplatedEmail(emailTemplate);
            }

        } );
    } else {
        const eventNotifyData = await currNotifyObj.data(notification.eventObjectId);
        if (currNotifyObj.notification) {
            const {title, body, image} = currNotifyObj.notification(eventNotifyData);
            await Notification.sendToAllUsers(title, body, image);
        }

        // if (currNotifyObj.email) {
        //     await emailClient.sendTemplatedEmail(currNotifyObj.email(eventNotifyData))
        // }
    }
        
}

exports.commonNotificationListener = functions
  .firestore
  .document('/notification/{id}')
  .onCreate(async (snap) => {
    return processNotification(snap.data() as INotificationModel);
  })
