import { getDiscussionMessageById } from '../util/db/discussionMessagesDb';
import { getDiscussionById } from '../util/db/discussionDbService';
import { proposalDb } from '../proposals/database';
import { commonDb } from '../common/database';

interface IEventData {
    eventObject: (eventObjId: string) => any;
    notifyUserFilter: (eventObj: any) => string[] | Promise<string[]>;
}

export enum EVENT_TYPES {
    // Common related events
    COMMON_CREATED = 'commonCreated',
    COMMON_CREATION_FAILED = 'commonCreationFailed',
    COMMON_WHITELISTED = 'commonWhitelisted',
    COMMON_MEMBER_ADDED = 'commonMemberAdded',


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
    PAYMENT_FAILED = 'paymentFailed',


    // Messaging related events
    MESSAGE_CREATED = 'messageCreated',
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
            return userFilter;
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
            const common =(await commonDb.getCommon(discussion.commonId));
            return common.members.map(member => member.userId)
        }
    },
    [EVENT_TYPES.COMMON_WHITELISTED]: {
        eventObject: async (commonId: string): Promise<any> => (await commonDb.getCommon(commonId)),
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        notifyUserFilter: async (dao: any): Promise<string[]> => {
            return [dao.members[0].userId];
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
    } 
}
