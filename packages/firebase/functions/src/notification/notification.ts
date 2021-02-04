import admin from 'firebase-admin';
import { EVENT_TYPES } from '../event/event';
import { env } from '../constants';
import { getUserById } from '../util/db/userDbService';
import { Utils } from '../util/util';
import { getDiscussionMessageById } from '../util/db/discussionMessagesDb';
import { proposalDb } from '../proposals/database';
import { commonDb } from '../common/database';
import { subscriptionDb } from '../subscriptions/database';
import { ISendTemplatedEmailData } from './email';
import { ISubscriptionEntity } from '../subscriptions/types';
import { IUserEntity } from '../users/types';
import { userDb } from '../users/database';
import { paymentDb } from '../circlepay/payments/database';
import { cardDb } from '../circlepay/cards/database';
import { ICardEntity } from '../circlepay/cards/types';
import { discussionDb } from '../discussion/database';
import moment from 'moment';
import { getFundingRequestAcceptedTemplate } from './helpers';

const messaging = admin.messaging();

const getNameString = (userData) => {
  if (!userData.firstName && userData.lastName) {
    return 'A Common member';
  }
  return `${userData.firstName || ''} ${userData.lastName || ''}`;
};

export interface INotification {
  send: any
}

const memberAddedNotification = (commonData) => ({
  title: 'Congrats!',
  body: `Your request to join "${commonData.name}" was accepted, you are now a member!`,
  image: commonData.image || '',
  path: `CommonProfile/${commonData.id}`
});


interface IEventData {
  data: (eventObj: string) => any;
  email?: (notifyData: any) => any;
  notification?: (notifyData: any) => any;
}

export const notifyData: Record<string, IEventData> = {
  [EVENT_TYPES.COMMON_CREATED]: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data: async (objectId: string) => {
      const commonData = (await commonDb.get(objectId));
      return {
        commonData,
        userData: (await getUserById(commonData.members[0].userId)).data()
      };
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    email: ({ commonData, userData }): ISendTemplatedEmailData[] => {
      return [
        {
          to: userData.email,
          templateKey: 'userCommonCreated',
          emailStubs: {
            userName: getNameString(userData),
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
            userName: getNameString(userData),
            userEmail: userData.email,
            commonCreatedOn: new Date().toDateString(),
            log: 'Successfully created common',
            commonId: commonData.id,
            commonName: commonData.name,
            tagline: commonData.metadata.byline,
            about: commonData.metadata.description,
            paymentType: 'one-time',
            minContribution: (commonData.metadata.minFeeToJoin / 100)
              .toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
              })
          }
        }
      ];
    }
  },
  [EVENT_TYPES.REQUEST_TO_JOIN_CREATED]: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data: async (proposalId: string) => {
      const proposalData = (await proposalDb.getProposal(proposalId));
      return {
        commonData: (await commonDb.get(proposalData.commonId)),
        userData: (await getUserById(proposalData.proposerId)).data()
      };
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    email: ({ commonData, userData }): ISendTemplatedEmailData => {
      return {
        to: userData.email,
        templateKey: 'requestToJoinSubmitted',
        emailStubs: {
          userName: getNameString(userData),
          link: Utils.getCommonLink(commonData.id),
          commonName: commonData.name
        }
      };
    }
  },
  [EVENT_TYPES.FUNDING_REQUEST_CREATED]: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data: async (objectId: string) => {
      const proposalData = (await proposalDb.getProposal(objectId));
      return {
        proposalData,
        commonData: (await commonDb.get(proposalData.commonId)),
        userData: (await getUserById(proposalData.proposerId)).data()
      };
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notification: async ({ proposalData, commonData, userData }) => {
      return {
        title: 'A new funding proposal in your Common!',
        body: `Your fellow member ${getNameString(userData)} is asking for $${proposalData.fundingRequest.amount / 100} for their proposal in "${commonData.name}". See the proposal and vote.`,
        image: commonData.image || '',
        path: `ProposalScreen/${commonData.id}/${proposalData.id}`
      };
    }

  },
  [EVENT_TYPES.COMMON_WHITELISTED]: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data: async (commonId: string) => {
      const commonData = (await commonDb.get(commonId));
      return {
        commonData,
        userData: (await getUserById(commonData.metadata.founderId)).data()
      };
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notification: async ({ commonData }) => {
      return {
        title: 'A new Common was just featured!',
        body: `A new Common was just featured: "${commonData.name}". You might want to check it out.`,
        image: commonData.image || '',
        path: `CommonProfile/${commonData.id}`
      };
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    email: ({ commonData, userData }): ISendTemplatedEmailData => {
      return {
        to: userData.email,
        templateKey: 'userCommonFeatured',
        emailStubs: {
          commonName: commonData.name,
          commonLink: Utils.getCommonLink(commonData.id),
          userName: getNameString(userData)
        }
      };
    }
  },
  [EVENT_TYPES.FUNDING_REQUEST_ACCEPTED]: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data: async (objectId: string) => {
      const proposalData = (await proposalDb.getProposal(objectId));
      const cards = await cardDb.getMany({
        ownerId: proposalData.proposerId,

        sort: {
          orderByDesc: 'updatedAt',
          limit: 1
        }
      });

      return {
        proposalData,
        commonData: (await commonDb.get(proposalData.commonId)),
        userData: (await getUserById(proposalData.proposerId)).data(),
        cardMetadata: cards[0]?.metadata
      };
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notification: async ({ proposalData, commonData }) => {
      return {
        title: 'Your funding proposal was approved!',
        body: `A funding proposal for $${proposalData.fundingRequest.amount / 100} was approved by "${commonData.name}".`,
        image: commonData.image || '',
        path: `ProposalScreen/${commonData.id}/${proposalData.id}`
      };
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    email: ({ userData, proposalData, commonData, cardMetadata }): ISendTemplatedEmailData[] => {
      const userTemplate = getFundingRequestAcceptedTemplate(cardMetadata?.billingDetails?.country, proposalData.fundingRequest.amount);
      return [
        {
          to: userData.email,
          from: proposalData.fundingRequest.amount === 0 ? env.mail.sender : env.mail.payoutEmail,
          bcc: env.mail.payoutEmail,
          templateKey: (userTemplate as any),
          emailStubs: {
            userName: getNameString(userData),
            proposal: proposalData.description.title,
            fundingAmount: (proposalData.fundingRequest.amount / 100).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD'
            }),
            commonName: commonData.name
          }
        },
        {
          to: env.mail.adminMail,
          templateKey: 'adminFundingRequestAccepted',
          emailStubs: {
            commonName: commonData.name,
            commonLink: Utils.getCommonLink(commonData.id),
            commonBalance: (commonData.balance / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            commonId: commonData.id,
            proposalId: proposalData.id,
            userName: getNameString(userData),
            userEmail: userData.email,
            userId: userData.uid,
            fundingAmount: (proposalData.fundingRequest.amount / 100).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD'
            }),
            submittedOn: proposalData.createdAt.toDate(),
            passedOn: new Date(),
            log: 'Funding request accepted'
          }
        }
      ];
    }
  },
  [EVENT_TYPES.FUNDING_REQUEST_ACCEPTED_INSUFFICIENT_FUNDS]: {
    data: async (objectId: string): Promise<any> => {
      const proposal = await proposalDb.getProposal(objectId);
      const common = await commonDb.get(proposal.commonId);
      const user = (await getUserById(proposal.proposerId)).data();

      return {
        user,
        common,
        proposal
      };
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    email: ({ user, proposal, common }): ISendTemplatedEmailData => ({
      to: user.email,
      templateKey: 'userFundingRequestAcceptedInsufficientFunds',
      emailStubs: {
        firstName: user.firstName,
        commonName: common.name,
        proposalName: proposal.description.title,
        amountRequested: (proposal.fundingRequest.amount / 100)
          .toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        commonBalance: (common.balance / 100)
          .toLocaleString('en-US', { style: 'currency', currency: 'USD' })
      }
    })
  },
  [EVENT_TYPES.REQUEST_TO_JOIN_EXECUTED]: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data: async (proposalId: string) => {
      const proposalData = (await proposalDb.getProposal(proposalId));
      return {
        commonData: (await commonDb.get(proposalData.commonId)),
        userData: (await getUserById(proposalData.proposerId)).data()
      };
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notification: async ({ commonData }) => memberAddedNotification(commonData),
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    email: ({ commonData, userData }): ISendTemplatedEmailData => {
      return {
        to: userData.email,
        templateKey: 'userJoinedSuccess',
        emailStubs: {
          userName: getNameString(userData),
          commonLink: Utils.getCommonLink(commonData.id),
          commonName: commonData.name
        }
      };
    }
  },

  [EVENT_TYPES.REQUEST_TO_JOIN_REJECTED]: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data: async (objectId: string) => {
      const proposalData = (await proposalDb.getProposal(objectId));
      return {
        commonData: (await commonDb.get(proposalData.commonId))
      };
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notification: async ({ commonData }) => {
      return {
        title: `Bad news, your request to join "${commonData.name}" was rejected.`,
        body: `Don't give up, there are plenty of other Commons you can join.`,
        image: commonData.image || '',
        path: `CommonProfile/${commonData.id}`
      };
    }
  },
  [EVENT_TYPES.MESSAGE_CREATED]: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data: async (messageId: string) => {
      const discussionMessage = (await getDiscussionMessageById(messageId)).data();
      const commonId = discussionMessage.commonId
        || (await proposalDb.getProposal(discussionMessage.discussionId))?.commonId;

      const path = discussionMessage.commonId
        ? `Discussions/${commonId}/${discussionMessage.discussionId}`
        : `ProposalScreen/${commonId}/${discussionMessage.discussionId}/1`; // 1 is tabIndex of chats in ProposalScreen

      return {
        sender: (await getUserById(discussionMessage.ownerId)).data(),
        commonData: (await commonDb.get(commonId)),
        path
      };
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notification: async ({ sender, commonData, path }) => (
      {
        title: `New comment!`,
        body: `The member ${getNameString(sender)} commented in "${commonData.name}"`,
        image: commonData.image || '',
        path
      }
    )
  },
  [EVENT_TYPES.DISCUSSION_CREATED]: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data: async (discussionId: string) => {
      const discussion = (await discussionDb.getDiscussion(discussionId));
      const commonId = discussion.commonId;

      const path = `Discussions/${commonId}/${discussionId}`;

      return {
        discussion,
        creator: (await getUserById(discussion.ownerId)).data(),
        commonData: (await commonDb.get(commonId)),
        path
      };
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notification: async ({ discussion, creator, commonData, path }) => (
      {
        title: `New post in ${commonData.name}`,
        body: `By ${getNameString(creator)}: "${discussion.title}"`,
        image: commonData.image || '',
        path
      }
    )
  },
  [EVENT_TYPES.PAYMENT_FAILED]: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data: async (proposalId: string) => {
      const proposalData = (await proposalDb.getProposal(proposalId));
      return {
        commonData: (await commonDb.get(proposalData.commonId)),
        userData: (await getUserById(proposalData.proposerId)).data()
      };
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    email: ({ commonData, userData }): ISendTemplatedEmailData => {
      return {
        to: userData.email,
        templateKey: 'userJoinedButFailedPayment',
        emailStubs: {
          userName: getNameString(userData),
          commonLink: Utils.getCommonLink(commonData.id),
          commonName: commonData.name
        }
      };
    }
  },
  [EVENT_TYPES.SUBSCRIPTION_CANCELED_BY_PAYMENT_FAILURE]: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data: async (subscriptionId) => {
      const subscription = await subscriptionDb.get(subscriptionId);
      const user = await userDb.get(subscription.userId);


      return {
        subscription,
        user
      };
    },

    email: ({ subscription, user }: {
      subscription: ISubscriptionEntity,
      user: IUserEntity
    }): ISendTemplatedEmailData => ({
      to: user.email,
      templateKey: 'subscriptionChargeFailed',
      emailStubs: {
        firstName: user.firstName,
        commonName: subscription.metadata.common.name,
        commonLink: Utils.getCommonLink(subscription.metadata.common.id)
      }
    })
  },
  [EVENT_TYPES.SUBSCRIPTION_CANCELED_BY_USER]: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data: async (subscriptionId) => {
      const subscription = await subscriptionDb.get(subscriptionId);
      const user = await userDb.get(subscription.userId);


      return {
        subscription,
        user
      };
    },

    email: ({ subscription, user }: {
      subscription: ISubscriptionEntity,
      user: IUserEntity
    }): ISendTemplatedEmailData => ({
      to: user.email,
      templateKey: 'subscriptionCanceled',
      emailStubs: {
        firstName: user.firstName,
        dueDate: moment(subscription.dueDate.toDate()).format('MMMM D, YYYY'),
        commonName: subscription.metadata.common.name,
        commonLink: Utils.getCommonLink(subscription.metadata.common.id)
      }
    })
  },
  [EVENT_TYPES.SUBSCRIPTION_PAYMENT_CONFIRMED]: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data: async (paymentId) => {
      const payment = await paymentDb.get(paymentId);
      const card = await cardDb.get(payment.source.id);
      const subscription = await subscriptionDb.get(payment.subscriptionId);
      const user = await userDb.get(subscription.userId);
      const commonData = subscription.metadata.common;

      return {
        subscription,
        user,
        card,
        commonData
      };
    },
    email: ({ subscription, user, card }: {
      subscription: ISubscriptionEntity,
      user: IUserEntity,
      card: ICardEntity
    }): ISendTemplatedEmailData => ({
      to: user.email,
      templateKey: 'subscriptionCharged',
      subjectStubs: {
        commonName: subscription.metadata.common.name
      },
      emailStubs: {
        firstName: user.firstName,
        commonName: subscription.metadata.common.name,
        commonLink: Utils.getCommonLink(subscription.metadata.common.id),
        chargeDate: moment(new Date()).format('MMMM D, YYYY'),
        lastDigits: card.metadata.digits,
        chargeAmount: (subscription.amount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
      }
    })
  }
};

export default new class Notification implements INotification {
  async send(tokens = [], title, body, image = '', path, options = {
    contentAvailable: true,
    mutable_content: true,
    priority: 'high'
  }) {
    const payload = {
      data: {
        path
      },
      notification: {
        title,
        body,
        image
      }
    };

    // @question Ask about this rule "promise/always-return". It is kinda useless so we may disable it globally?
    // eslint-disable-next-line promise/always-return
    // sendToDevice cannot have an empty tokens array
    const messageSent: admin.messaging.MessagingDevicesResponse = tokens.length > 0 && await messaging.sendToDevice(tokens, payload, options);

    logger.debug('Send Success', messageSent);
  }
};
