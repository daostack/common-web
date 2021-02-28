import {
  ISubscriptionEntity,
  IUserEntity,
  IEventObject,
  INotification,
  IProposalEntity,
  ICommonEntity,
  IDiscussionEntity,
  ICardMetadata,
  IFundingRequestProposal
} from '@common/types';
import admin from 'firebase-admin';
import moment from 'moment';

import { cardDb } from '../circlepay/cards/database';
import { ICardEntity } from '../circlepay/cards/types';
import { paymentDb } from '../circlepay/payments/database';
import { commonDb } from '../common/database';
import { env } from '../constants';
import { EVENT_TYPES } from '../event/event';
import { proposalDb } from '../proposals/database';
import { subscriptionDb } from '../subscriptions/database';
import { userDb } from '../core/domain/users/database';
import { getDiscussionMessageById } from '../util/db/discussionMessagesDb';
import { getUserById } from '../util/db/userDbService';
import { discussionDb } from '../discussion/database';
import { Utils } from '../util/util';
import { ISendTemplatedEmailData } from './email';
import { getFundingRequestAcceptedTemplate } from './helpers';

const messaging = admin.messaging();

const getNameString = (userData): string => {
  if (!userData.firstName && userData.lastName) {
    return 'A Common member';
  }
  return `${userData.firstName || ''} ${userData.lastName || ''}`;
};

/**
 * Should handle notifying moderators about items being reported
 * right now, the userFilter we get from `event` is the founder of
 * the common becuase getting moderators is expensive ->  we need to get the data
 * of each user and search their `roles` entity @discuss perhaps we can add the list
 * of moderators to the common as well
 * 
 * @param  reporter   - the userEntity of the reported
 * @param  commonData - the common data of the reported item's common
 * @param  path       - the path for the notification navigation
 * @param  type       - the type of the item -> discussion, comment, proposals
 */
const notifyModerators = (reporter: IUserEntity, commonData: ICommonEntity, path: string, type: string): Record<string, string> => ({
    title: `A ${type} was reported`,
    body: `The member ${getNameString(reporter)} reported a ${type} in "${commonData.name}"`,
    image: commonData.image || '',
    path
  })

export const notifyData: Record<string, IEventObject> = {
  [EVENT_TYPES.COMMON_CREATED]: {
    data: async (objectId: string): Promise<Record<string, any>> => {
      const commonData = (await commonDb.get(objectId));
      return {
        commonData,
        userData: (await getUserById(commonData.members[0].userId)).data()
      };
    },
    email: ({ commonData, userData }: {
        commonData: ICommonEntity;
        userData:IUserEntity;
      }): ISendTemplatedEmailData[] => {
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
    data: async (proposalId: string): Promise<Record<string, any>> => {
      const proposalData = (await proposalDb.getProposal(proposalId));
      return {
        commonData: (await commonDb.get(proposalData.commonId)),
        userData: (await getUserById(proposalData.proposerId)).data(),
        proposalData
      };
    },
    notification: async ({commonData, proposalData }: {
      commonData: ICommonEntity,
      proposalData: IProposalEntity
    }): Promise<Record<string, any>> => {
      return {
        title: `New members want to join ${commonData.name}`,
        body: 'Your Common has new pending members, view their requests and vote',
        image: commonData.image || '',
        path: `ProposalScreen/${commonData.id}/${proposalData.id}`
      }
    },
    email: ({ commonData, userData }: {
      commonData: ICommonEntity,
      userData: IUserEntity,
    }): ISendTemplatedEmailData => {
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
    data: async (objectId: string): Promise<Record<string, any>> => {
      const proposalData = (await proposalDb.getProposal(objectId));
      return {
        proposalData,
        commonData: (await commonDb.get(proposalData.commonId)),
        userData: (await getUserById(proposalData.proposerId)).data()
      };
    },
    notification: async ({ proposalData, commonData, userData }: {
      proposalData: IFundingRequestProposal;
      commonData: ICommonEntity;
      userData: IUserEntity;
    }): Promise<Record<string, any>> => {
      return {
        title: 'A new funding proposal in your Common!',
        body: `Your fellow member ${getNameString(userData)} is asking for $${proposalData.fundingRequest.amount / 100} for their proposal in "${commonData.name}". See the proposal and vote.`,
        image: commonData.image || '',
        path: `ProposalScreen/${commonData.id}/${proposalData.id}`
      };
    }

  },
  [EVENT_TYPES.COMMON_WHITELISTED]: {
    data: async (commonId: string): Promise<Record<string, any>> => {
      const commonData = (await commonDb.get(commonId));
      return {
        commonData,
        userData: (await getUserById(commonData.metadata.founderId)).data()
      };
    },
    notification: async ({ commonData }: {
      commonData: ICommonEntity;
    }): Promise<Record<string, any>> => {
      return {
        title: 'A new Common was just featured!',
        body: `A new Common was just featured: "${commonData.name}". You might want to check it out.`,
        image: commonData.image || '',
        path: `CommonProfile/${commonData.id}`
      };
    },
    email: ({ commonData, userData }: {
      commonData: ICommonEntity;
      userData: IUserEntity;
    }): ISendTemplatedEmailData => {
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
  [EVENT_TYPES.DISCUSSION_MESSAGE_REPORTED]: {
    data: async (messageId: string): Promise<Record<string, any>> => {
      const discussionMessage = (await getDiscussionMessageById(messageId)).data();
      const commonId = discussionMessage.commonId
        || (await proposalDb.getProposal(discussionMessage.discussionId))?.commonId;

      const path = discussionMessage.commonId
        ? `Discussions/${commonId}/${discussionMessage.discussionId}`
        : `ProposalScreen/${commonId}/${discussionMessage.discussionId}/1`; // 1 is tabIndex of chats in ProposalScreen

      const rep = (await getUserById(discussionMessage?.moderation?.reporter)).data();
      return {
        reporter: rep,//(await getUserById(discussionMessage?.moderation?.reporter)).data(),
        commonData: (await commonDb.get(commonId)),
        path
      };
    },
    notification: async ({ reporter, commonData, path }): Promise<Record<string, string>> => notifyModerators(reporter, commonData, path, 'comment')
  },
  [EVENT_TYPES.PROPOSAL_REPORTED]: {
    data: async (proposalId: string): Promise<Record<string, any>> => {
      const proposalData = (await proposalDb.getProposal(proposalId));
      const commonData = (await commonDb.get(proposalData.commonId));
      return {
        reporter: (await getUserById(proposalData?.moderation?.reporter)).data(),
        commonData,
        path: `ProposalScreen/${commonData.id}/${proposalData.id}`
      };
    },
    notification: async ({ reporter, commonData, path }): Promise<Record<string, string>> => notifyModerators(reporter, commonData, path, 'proposal')
  },
  [EVENT_TYPES.DISCUSSION_REPORTED]: {
    data: async (discussionId: string): Promise<Record<string, any>> => {
      const discussion = (await discussionDb.getDiscussion(discussionId));
      const commonId = discussion.commonId;

      const path = `Discussions/${commonId}/${discussionId}`;

      return {
        discussion,
        reporter: (await getUserById(discussion?.moderation?.reporter)).data(),
        commonData: (await commonDb.get(commonId)),
        path
      };
    },
    notification: async ({reporter, commonData, path }): Promise<Record<string, string>> => notifyModerators(reporter, commonData, path, 'post')
  },
  [EVENT_TYPES.FUNDING_REQUEST_ACCEPTED]: {
    data: async (objectId: string): Promise<Record<string, any>> => {
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
    notification: async ({ proposalData, commonData }: {
      proposalData: IFundingRequestProposal;
      commonData: ICommonEntity;
    }): Promise<Record<string, any>> => {
      return {
        title: 'Your funding proposal was approved!',
        body: `A funding proposal for $${proposalData.fundingRequest.amount / 100} was approved by "${commonData.name}".`,
        image: commonData.image || '',
        path: `ProposalScreen/${commonData.id}/${proposalData.id}`
      };
    },
    email: ({ userData, proposalData, commonData, cardMetadata }: {
      userData: IUserEntity;
      proposalData: IFundingRequestProposal;
      commonData: ICommonEntity;
      cardMetadata: ICardMetadata;
    }): ISendTemplatedEmailData[] => {
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
    email: ({ user, proposal, common }: {
      user: IUserEntity;
      proposal: IFundingRequestProposal;
      common: ICommonEntity;
    }): ISendTemplatedEmailData => ({
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
  [EVENT_TYPES.COMMON_MEMBER_ADDED]: {
    data: async (proposalId: string): Promise<Record<string, any>> => {
      const proposalData = (await proposalDb.getProposal(proposalId));
      return {
        commonData: (await commonDb.get(proposalData.commonId)),
        userData: (await getUserById(proposalData.proposerId)).data()
      };
    },
    notification: async ({ commonData }: {
      commonData: ICommonEntity;
    }): Promise<Record<string, string>> => {
      return {
        title: 'Congrats!',
        body: `Your request to join "${commonData.name}" was accepted, you are now a member!`,
        image: commonData.image || '',
        path: `CommonProfile/${commonData.id}`
      }
    },
    email: ({ commonData, userData }: {
      commonData: ICommonEntity;
      userData: IUserEntity;
    }): ISendTemplatedEmailData => {
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
    data: async (objectId: string): Promise<Record<string, any>> => {
      const proposalData = (await proposalDb.getProposal(objectId));
      return {
        commonData: (await commonDb.get(proposalData.commonId))
      };
    },
    notification: async ({ commonData }: {
      commonData: ICommonEntity;
    }): Promise<Record<string, string>> => {
      return {
        title: `Bad news, your request to join "${commonData.name}" was rejected.`,
        body: `Don't give up, there are plenty of other Commons you can join.`,
        image: commonData.image || '',
        path: `CommonProfile/${commonData.id}`
      };
    }
  },
  [EVENT_TYPES.MESSAGE_CREATED]: {
    data: async (messageId: string): Promise<Record<string, any>> => {
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
    notification: async ({ sender, commonData, path }: {
      sender: IUserEntity;
      commonData: ICommonEntity;
      path: string;
    }): Promise<Record<string, string>> => (
      {
        title: `New comment!`,
        body: `The member ${getNameString(sender)} commented in "${commonData.name}"`,
        image: commonData.image || '',
        path
      }
    )
  },
  [EVENT_TYPES.DISCUSSION_CREATED]: {
    data: async (discussionId: string): Promise<Record<string, any>> => {
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
    notification: async ({ discussion, creator, commonData, path }: {
      discussion: IDiscussionEntity;
      creator: IUserEntity;
      commonData: ICommonEntity;
      path: string;
    }): Promise<Record<string, string>> => (
      {
        title: `New post in ${commonData.name}`,
        body: `By ${getNameString(creator)}: "${discussion.title}"`,
        image: commonData.image || '',
        path
      }
    )
  },
  [EVENT_TYPES.PAYMENT_FAILED]: {
    data: async (proposalId: string): Promise<Record<string, any>> => {
      const proposalData = (await proposalDb.getProposal(proposalId));
      return {
        commonData: (await commonDb.get(proposalData.commonId)),
        userData: (await getUserById(proposalData.proposerId)).data()
      };
    },
    email: ({ commonData, userData }: {
      commonData: ICommonEntity;
      userData: IUserEntity;
    }): ISendTemplatedEmailData => {
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
    data: async (subscriptionId: string): Promise<Record<string, any>> => {
      const subscription = await subscriptionDb.get(subscriptionId);
      const user = await userDb.get(subscription.userId);


      return {
        subscription,
        user
      };
    },

    email: ({ subscription, user }: {
      subscription: ISubscriptionEntity;
      user: IUserEntity;
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
    data: async (subscriptionId: string): Promise<Record<string, any>> => {
      const subscription = await subscriptionDb.get(subscriptionId);
      const user = await userDb.get(subscription.userId);


      return {
        subscription,
        user
      };
    },

    email: ({ subscription, user }: {
      subscription: ISubscriptionEntity;
      user: IUserEntity;
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
    data: async (paymentId: string): Promise<Record<string, any>> => {
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
      subscription: ISubscriptionEntity;
      user: IUserEntity;
      card: ICardEntity;
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
  send = async (tokens = [], title, body, image = '', path, options = {
    contentAvailable: true,
    mutableContent: true,
    priority: 'high'
  }): Promise<void> => {
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
