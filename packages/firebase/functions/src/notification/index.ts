import * as functions from 'firebase-functions';
import { getUserById } from '../util/db/userDbService';
import Notification from './notification';
import emailClient from './email';
import { notifyData } from './notification';

export interface INotificationModel {
    userFilter: string[],
    createdAt: string,
    eventObjectId: string,
    eventType: string,
    eventId: string,
}

/**
 * Process notification && email sendings
 *   - send notifications to users in userFilter, if there's on user filter, send to all
 *   - send emails to email addresses in the the template in the currNotifyObj
 * @param notification     - notification object with data of what and to whom to send it
 */
const processNotification = async (notification: INotificationModel) => {

    const currNotifyObj = notifyData[notification.eventType];

    if (!currNotifyObj.data) {
        throw Error(`Not found data method for notification on event type "${notification.eventType}".`);
    }

    const eventNotifyData = await currNotifyObj.data(notification.eventObjectId);
    
    if (notification.userFilter) {
        notification.userFilter.forEach( async filterUserId => {
            const userData: any = (await getUserById(filterUserId)).data();

            if (currNotifyObj.notification) {
              try {
                const {title, body, image, path} = await currNotifyObj.notification(eventNotifyData);
                await Notification.send(userData.tokens, title, body, image, path);
              } catch(err) {
                logger.error('Notification send err -> ', err)
                throw err
              }
            }
        });
    }
    // handling email sending separately  from notifications because we don't want to send as many emails as userFilter.length
    if (currNotifyObj.email) {
      const emailTemplate = currNotifyObj.email(eventNotifyData);
      const emailTemplateArr = Array.isArray(emailTemplate) ? emailTemplate : [emailTemplate];
      emailTemplateArr.forEach( async (currEmailTemplate) => {
          const template = currEmailTemplate;
          await emailClient.sendTemplatedEmail(template);
      });
    }  
}

exports.commonNotificationListener = functions
  .firestore
  .document('/notification/{id}')
  .onCreate(async (snap) => {
    return processNotification(snap.data() as INotificationModel);
  })
