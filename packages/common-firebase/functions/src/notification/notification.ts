import admin from 'firebase-admin';
import { EVENT_TYPES } from "../event/event";
import { env } from '@env';
import { getDaoById } from '../db/daoDbService';
import { getProposalById } from '../db/proposalDbService';
import { getUserById } from '../db/userDbService';

const messaging = admin.messaging();

export interface INotification {
  send: any
}

interface IEventData {
  data: (eventObj: string) => any;
  email?: (notifyData: any) => any;
  notification?: (notifyData: any) => any;
}

export const notifyData: Record<string, IEventData> = {
  [EVENT_TYPES.CREATION_COMMON]: {
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      data: async (objectId: string) => {
          return {
              commonData: (await getDaoById(objectId)).data()
          }
      },
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      email: ( {commonData} ) => {
          return {
              to: env.mail.adminMail,
              templateKey: 'adminWalletCreationFailed',
              emailStubs: {
                  commonName: commonData.name,
                  commonId: commonData.id
              }
          }
      }
  },
  [EVENT_TYPES.CREATION_COMMON_FAILED] : {
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      data: async (objectId: string) => {
          return {
              commonData: (await getDaoById(objectId)).data()
          }
      },
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      email: ( {commonData} ) => {
          return {
              to: env.mail.adminMail,
              templateKey: 'adminWalletCreationFailed',
              emailStubs: {
                  commonName: commonData.name,
                  commonId: commonData.id
              }
          }
      }
  },
  [EVENT_TYPES.CREATION_PROPOSAL] : {
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      data: async (objectId: string) => {
          return {
              proposalData: (await getProposalById(objectId)).data(),
              commonData: (await getDaoById(objectId)).data(),
              userData: (await getUserById(objectId)).data()
          }
      },
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      notification: async ( {proposalData, commonData, userData} ) => {
          return {
              title: 'A new funding proposal in your Common!',
              body: `${userData.firstName} is asking for ${proposalData.fundingRequest.amount / 100} for their proposal in "${commonData.name}". See the proposal and vote.`,
              image: commonData.metadata.image || ''
          }
      },
      
  },
}

export default new class Notification implements INotification {
  async send(tokens, title, body, image = '', options = {
    contentAvailable: true,
    mutable_content: true,
    priority: 'high'
  }) {
    const payload = {
      notification: {
        title,
        body,
        icon: image
      },
    };

    // @question Ask about this rule "promise/always-return". It is kinda useless so we may disable it globally?
    // eslint-disable-next-line promise/always-return
    const messageSent: admin.messaging.MessagingDevicesResponse = await messaging.sendToDevice(tokens, payload, options);
    console.log('Send Success', messageSent);
  }

  async sendToAllUsers(title: string, body: string, image = '') {
    const payload = {
      topic: "notification",
      android: {
        priority: 'high'
      },
      notification: {
        title,
        body,
        icon: image
      },
    } as admin.messaging.Message;
    
    console.log("payload -> ", payload);

    // @question Ask about this rule "promise/always-return". It is kinda useless so we may disable it globally?
    // eslint-disable-next-line promise/always-return
    const messageSent: string = await messaging.send(payload);
    console.log('Send Success', messageSent);
  }
};
