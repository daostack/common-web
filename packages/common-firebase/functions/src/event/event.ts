import { getDiscussionMessageById } from '../util/db/discussionMessagesDb';
import { getDiscussionById } from '../util/db/discussionDbService';
import { proposalDb } from '../proposals/database';
import { commonDb } from '../common/database';
import { getAllUsers } from '../util/db/userDbService';
import { subscriptionDb } from '../subscriptions/database';
import { paymentDb } from '../circlepay/payments/database';
import { ISubscriptionPayment } from '../circlepay/payments/types';

interface IEventData {
  eventObject: (eventObjId: string) => any;
  notifyUserFilter: (eventObj: any) => string[] | Promise<string[]>;
}

// excluding event owner (message creator, etc) from userFilter so she wouldn't get notified
const excludeOwner = (membersId: string[], ownerId: string): string[] => (
  membersId.filter((memberId) => memberId !== ownerId)
);

export enum EVENT_TYPES {
  // Common related events
  COMMON_CREATED = 'commonCreated',
  COMMON_CREATION_FAILED = 'commonCreationFailed',
  COMMON_WHITELISTED = 'commonWhitelisted',
  COMMON_MEMBER_ADDED = 'commonMemberAdded',
  COMMON_MEMBER_REMOVED = 'commonMemberRemoved',


  // Request to join related events
  REQUEST_TO_JOIN_CREATED = 'requestToJoinCreated',
  REQUEST_TO_JOIN_ACCEPTED = 'requestToJoinAccepted',
  REQUEST_TO_JOIN_REJECTED = 'requestToJoinRejected',
  REQUEST_TO_JOIN_EXECUTED = 'requestToJoinExecuted',


  // Funding request related event
  FUNDING_REQUEST_CREATED = 'fundingRequestCreated',
  FUNDING_REQUEST_ACCEPTED = 'fundingRequestAccepted',
  FUNDING_REQUEST_REJECTED = 'fundingRequestRejected',
  FUNDING_REQUEST_EXECUTED = 'fundingRequestExecuted',


  // Voting related events
  VOTE_CREATED = 'voteCreated',


  // Payment related events
  PAYMENT_CREATED = 'paymentCreated',
  PAYMENT_CONFIRMED = 'paymentConfirmed',
  PAYMENT_UPDATED = 'paymentConfirmed',
  PAYMENT_FAILED = 'paymentFailed',
  PAYMENT_PAID = 'paymentPaid',

  // Payout related events
  PAYOUT_CREATED = 'payoutCreated',
  PAYOUT_APPROVED = 'payoutApproved',
  PAYOUT_EXECUTED = 'payoutExecuted',
  PAYOUT_VOIDED = 'payoutVoided',

  PAYOUT_COMPLETED = 'payoutCompleted',
  PAYOUT_FAILED = 'payoutFailed',

  // Card related events
  CARD_CREATED = 'cardCreated',

  // Messaging related events
  MESSAGE_CREATED = 'messageCreated',

  // Subscriptions
  SUBSCRIPTION_CREATED = 'subscriptionCreated',
  SUBSCRIPTION_PAYMENT_CREATED = 'subscriptionPaymentCreated',
  SUBSCRIPTION_PAYMENT_FAILED = 'subscriptionPaymentFailed',
  SUBSCRIPTION_PAYMENT_CONFIRMED = 'subscriptionPaymentConfirmed',
  SUBSCRIPTION_PAYMENT_STUCK = 'subscriptionPaymentStuck',
  SUBSCRIPTION_CANCELED_BY_USER = 'subscriptionCanceledByUser',
  SUBSCRIPTION_CANCELED_BY_PAYMENT_FAILURE = 'subscriptionCanceledByPaymentFailure',

  // Membership
  MEMBERSHIP_REVOKED = 'membershipRevoked'
}

export const eventData: Record<string, IEventData> = {
  [EVENT_TYPES.COMMON_CREATED]: {
    eventObject: async (commonId: string): Promise<any> => (await commonDb.getCommon(commonId)),
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notifyUserFilter: (common: any): string[] => {
      return [common.members[0].userId];
    }
  },
  [EVENT_TYPES.COMMON_CREATION_FAILED]: {
    eventObject: async (commonId: string): Promise<any> => (await commonDb.getCommon(commonId)),
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notifyUserFilter: (common: any): string[] => {
      return [common.members[0].userId];
    }
  },
  [EVENT_TYPES.FUNDING_REQUEST_CREATED]: {
    eventObject: async (proposalId: string): Promise<any> => (await proposalDb.getProposal(proposalId)),
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notifyUserFilter: async (proposal: any): Promise<string[]> => {
      const proposalDao = (await commonDb.getCommon(proposal.commonId));
      const userFilter = proposalDao.members.map(member => {
        return member.userId;
      });
      return excludeOwner(userFilter, proposal.proposerId);
    }
  },
  [EVENT_TYPES.REQUEST_TO_JOIN_CREATED]: {
    eventObject: async (proposalId: string): Promise<any> => (await proposalDb.getProposal(proposalId)),
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notifyUserFilter: async (proposal: any): Promise<string[]> => {
      return [
        proposal.proposerId
      ];
    }
  },
  [EVENT_TYPES.MESSAGE_CREATED]: {
    eventObject: async (discussionMessageId: string): Promise<any> => (await getDiscussionMessageById(discussionMessageId)).data(),
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notifyUserFilter: async (discussionMessage: any): Promise<string[]> => {
      // message can be attached to a discussion or to a proposal (in proposal chat)
      const discussion = (await getDiscussionById(discussionMessage.discussionId)).data()
        || (await proposalDb.getProposal(discussionMessage.discussionId));
      const common = (await commonDb.getCommon(discussion.commonId));
      const membersId = common.members.map((member) => member.userId);
      return excludeOwner(membersId, discussionMessage.ownerId);
    }
  },
  [EVENT_TYPES.COMMON_WHITELISTED]: {
    eventObject: async (commonId: string): Promise<any> => (await commonDb.getCommon(commonId)),
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notifyUserFilter: async (dao: any): Promise<string[]> => {
      const allUsers = await getAllUsers();
      const usersId = allUsers.map((user) => user.uid);
      return excludeOwner(usersId, dao.members[0].userId);
    }
  },
  [EVENT_TYPES.FUNDING_REQUEST_ACCEPTED]: {
    eventObject: async (proposalId: string): Promise<any> => (await proposalDb.getProposal(proposalId)),
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notifyUserFilter: async (proposal: any): Promise<string[]> => {
      return [proposal.proposerId];
    }
  },
  [EVENT_TYPES.REQUEST_TO_JOIN_ACCEPTED]: {
    eventObject: async (proposalId: string): Promise<any> => (await proposalDb.getProposal(proposalId)),
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notifyUserFilter: async (proposal: any): Promise<string[]> => {
      return [proposal.proposerId];
    }
  },
  [EVENT_TYPES.FUNDING_REQUEST_REJECTED]: {
    eventObject: async (proposalId: string): Promise<any> => (await proposalDb.getProposal(proposalId)),
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notifyUserFilter: async (proposal: any): Promise<string[]> => {
      return [proposal.proposerId];
    }
  },
  [EVENT_TYPES.REQUEST_TO_JOIN_REJECTED]: {
    eventObject: async (proposalId: string): Promise<any> => (await proposalDb.getProposal(proposalId)),
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notifyUserFilter: async (proposal: any): Promise<string[]> => {
      return [proposal.proposerId];
    }
  },
  [EVENT_TYPES.PAYMENT_FAILED]: {
    eventObject: async (proposalId: string): Promise<any> => (await proposalDb.getProposal(proposalId)),
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notifyUserFilter: async (proposal: any): Promise<string[]> => {
      return [proposal.proposerId];
    }
  },
  [EVENT_TYPES.SUBSCRIPTION_CANCELED_BY_PAYMENT_FAILURE]: {
    eventObject: async (subscriptionId: string): Promise<any> => (await subscriptionDb.get(subscriptionId)),
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notifyUserFilter: async (subscription: any): Promise<string[]> => {
      return [subscription.userId];
    }
  },
  [EVENT_TYPES.SUBSCRIPTION_PAYMENT_CONFIRMED]: {
    eventObject: async (paymentId: string): Promise<any> => (await paymentDb.get(paymentId)),
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notifyUserFilter: async (payment: ISubscriptionPayment): Promise<string[]> => {
      return [payment.userId];
    }
  },
  [EVENT_TYPES.SUBSCRIPTION_CANCELED_BY_USER]: {
    eventObject: async (subscriptionId: string): Promise<any> => (await subscriptionDb.get(subscriptionId)),
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    notifyUserFilter: async (subscription: any): Promise<string[]> => {
      return [subscription.userId];
    }
  }
};
