import admin from 'firebase-admin';
import { EVENT_TYPES } from "../event/event";
import { env } from '../constants';
import { getDaoById } from '../util/db/daoDbService';
import { getProposalById } from '../util/db/proposalDbService';
import { getUserById } from '../util/db/userDbService';
import { Utils } from '../util/util';
import { getDiscussionMessageById } from '../db/discussionMessagesDb'; 

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
          const commonData = (await getDaoById(objectId)).data();
          return {
            commonData,
            userData: (await getUserById(commonData.members[0].userId)).data(),
          }
      },
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      email: ( {commonData, userData} ) => {
        return [
          {
            templateKey: 'userCommonCreated',
            emailStubs: {
              name: userData.displayName,
              commonName: commonData.name,
              commonLink: Utils.getCommonLink(commonData.id)
            }
          },
          {
            to: env.mail.adminMail,
            templateKey: 'adminCommonCreated',
            emailStubs: {
              userId: userData.uid,
              commonLink: Utils.getCommonLink(commonData.id),
              userName: userData.displayName,
              userEmail: userData.email,
              commonCreatedOn: new Date().toDateString(),
              log: 'Successfully created common',
              commonId: commonData.id,
              commonName: commonData.name,
              description: commonData.metadata.description,
              about: commonData.metadata.byline,
              paymentType: 'one-time',
              minContribution: commonData.metadata.minimum
            }
          }
        ]
      }
  },
  // [EVENT_TYPES.CREATION_COMMON_FAILED] : {
  //     // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  //     data: async (objectId: string) => {
  //         return {
  //             commonData: (await getDaoById(objectId)).data()
  //         }
  //     },
  //     // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  //     email: ( {commonData} ) => {
  //         return {
  //             templateKey: 'adminWalletCreationFailed',
  //             emailStubs: {
  //                 commonName: commonData.name,
  //                 commonId: commonData.id
  //             }
  //         }
  //     }
  // },
  [EVENT_TYPES.REQUEST_TO_JOIN_CREATED] : {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data: async (proposalId: string) => {
        const proposalData = (await getProposalById(proposalId)).data();
        return {
            commonData: (await getDaoById(proposalData.dao)).data(),
            userData: (await getUserById(proposalData.proposerId)).data()
        }
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    email: ({ commonData, userData } ) => {
        return {
          to: userData.email,
          templateKey: 'requestToJoinSubmitted',
          emailStubs: {
            name: userData.displayName,
            link: Utils.getCommonLink(commonData.id),
            commonName: commonData.metadata.name
          }
        }
    }
  },
  [EVENT_TYPES.CREATION_PROPOSAL] : {
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      data: async (objectId: string) => {
          const proposalData = (await getProposalById(objectId)).data();
          return {
              proposalData,
              commonData: (await getDaoById(proposalData.dao)).data(),
              userData: (await getUserById(proposalData.proposerId)).data(),
          }
      },
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      notification: async ( {proposalData, commonData, userData} ) => {
          return {
              title: 'A new funding proposal in your Common!',
              body: `${userData.firstName} is asking for ${proposalData.fundingRequest.amount / 100} for their proposal in "${commonData.name}". See the proposal and vote.`,
              image: commonData.metadata.image || '',
              path: `ProposalScreen/${commonData.id}/${proposalData.id}`,
          }
      },
      
  },
  [EVENT_TYPES.COMMON_WHITELISTED] : {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data: async (objectId: string) => {
        return { 
          commonData : (await getDaoById(objectId)).data()
        }
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    email: ( {commonData} ) => {
      return {
        templateKey: 'userCommonFeatured',
        emailStubs: {
            commonName: commonData.name,
            commonId: commonData.id,
            commonLink: Utils.getCommonLink(commonData.id)
        }
      }
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notification: async ( {commonData} ) => {
        return {
            title: 'A new Common was just featured!',
            body: `A new Common was just featured: "${commonData.name}". You might want to check it out.`,
            image: commonData.metadata.image || '',
            path: `CommonProfile/${commonData.id}`
        }
    },
    
  },
  [EVENT_TYPES.APPROVED_FUNDING_REQUEST] : {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data: async (objectId: string) => {
        const proposalData = (await getProposalById(objectId)).data();
        return { 
          proposalData,
          commonData : (await getDaoById(proposalData.dao)).data()
        }
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notification: async ( {proposalData , commonData} ) => {
        return {
            title: 'Your funding proposal was approved!',
            body: `A funding proposal for ${proposalData.fundingRequest.amount} was approved by "${commonData.name}".`,
            image: commonData.metadata.image || '',
            path: `ProposalScreen/${commonData.id}/${proposalData.id}`,
        }
    },
  },
  [EVENT_TYPES.REQUEST_TO_JOIN_ACCEPTED]: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data: async (objectId: string) => {
        const proposalData = (await getProposalById(objectId)).data();
        return { 
          commonData : (await getDaoById(proposalData.dao)).data()
        }
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notification: async ( {commonData} ) => {
        return {
            title: 'Congrats!',
            body: `Your request to join "${commonData.name}" was accepted, you are now a member!`,
            image: commonData.metadata.image || '',
            path: `CommonProfile/${commonData.id}`
        }
    },
  },
  
  [EVENT_TYPES.REQUEST_TO_JOIN_REJECTED]: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data: async (objectId: string) => {
        const proposalData = (await getProposalById(objectId)).data();
        return { 
          commonData : (await getDaoById(proposalData.dao)).data()
        }
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notification: async ( {commonData} ) => {
        return {
            title: `Bad news, your request to join "${commonData.name}" was rejected.`,
            body: `Don't give up, there are plenty of other Commons you can join.`,
            image: commonData.metadata.image || '',
            path: `CommonProfile/${commonData.id}`
        }
    },
  },
  [EVENT_TYPES.MESSAGE_CREATED]: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data: async (messageId: string) => {
        const message = (await getDiscussionMessageById(messageId)).data();
        return {
          message,
          sender: (await getUserById(message.ownerId)).data(),
          commonData : (await getDaoById(message.commonId)).data()
        }
      },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notification: async ( {message, sender, commonData} ) => (
      {
          title: `New message!`,
          body: `${sender.displayName} commented in "${commonData.name}"`,
          image: commonData.metadata.image || '',
          path: `Discussions/${commonData.id}/${message.discussionId}`
      }
    ),
  }
  // TODO: We don't have defined notification for the rejected funding proposal. Ask if we need that.
  //
  // [EVENT_TYPES.REJECTED_PROPOSAL]: {
  //   // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  //   data: async (objectId: string) => {
  //       const proposalData = (await getProposalById(objectId)).data();
  //       return { 
  //         proposalData,
  //         commonData : (await getDaoById(proposalData.dao)).data()
  //       }
  //   },
  //   // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  //   notification: async ( {proposalData , commonData} ) => {
  //       return {
  //           title: 'Your funding proposal was approved!',
  //           body: `A funding proposal for ${proposalData.fundingRequest.amount} was approved by "${commonData.name}".`,
  //           image: commonData.metadata.image || ''
  //       }
  //   },
  // },
}

export default new class Notification implements INotification {
  async send(tokens, title, body, image = '', path, options = {
    contentAvailable: true,
    mutable_content: true,
    priority: 'high',
  }) {
    const payload = {
      data: {
        path
      },
      notification: {
        title,
        body,
        image,
      },
    };

    // @question Ask about this rule "promise/always-return". It is kinda useless so we may disable it globally?
    // eslint-disable-next-line promise/always-return
    const messageSent: admin.messaging.MessagingDevicesResponse = await messaging.sendToDevice(tokens, payload, options);
    console.log('Send Success', messageSent);
  }

  async sendToAllUsers(title: string, body: string, image = '', path: string) {
    const payload = {
      topic: "notification",
      android: {
        priority: 'high'
      },
      data: {
        path
      },
      notification: {
        title,
        body,
        image,
      },
    } as admin.messaging.Message;
    
    console.log("payload -> ", payload);

    // @question Ask about this rule "promise/always-return". It is kinda useless so we may disable it globally?
    // eslint-disable-next-line promise/always-return
    const messageSent: string = await messaging.send(payload);
    console.log('Send Success', messageSent);
  }
};
