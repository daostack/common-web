import { getDaoById } from '../util/db/daoDbService';
import { getProposalById } from '../util/db/proposalDbService';

interface IEventData {
    eventObject: (eventObjId: string) => any;
    notifyUserFilter: (eventObj: any) => string[] | Promise<string[]>;
}

export enum EVENT_TYPES {
    //CREATION notifications
    CREATION_COMMON = 'creationCommon',
    CREATION_COMMON_FAILED = 'creationCommonFailed',
    CREATION_PROPOSAL = 'creationProposal',
    CREATION_REQUEST_TO_JOIN = 'creationReqToJoin',
    //APPROVED notifications
    APPROVED_JOIN_REQUEST = 'approvedJoinRequest',
    APPROVED_FUNDING_REQUEST = 'approvedFundingRequest',
    //REJECTED notifications
    REJECTED_JOIN_REQUEST = 'rejectedJoinRequest',
    REJECTED_FUNDING_REQUEST = 'rejectedFundingRequest',
    //COMMON 
    COMMON_WHITELISTED = 'commonWhitelisted',
}

export const eventData: Record<string, IEventData> = {
    [EVENT_TYPES.CREATION_COMMON]: {
        eventObject: async (commonId: string): Promise<any> => (await getDaoById(commonId)).data(),
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        notifyUserFilter: (common: any): string[] => {
            return [common.members[0].userId];
        }
    },
    [EVENT_TYPES.CREATION_COMMON_FAILED]: {
        eventObject: async (commonId: string): Promise<any> => (await getDaoById(commonId)).data(),
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        notifyUserFilter: (common: any): string[] => {
            return [common.members[0].userId];
        }
    },
    [EVENT_TYPES.CREATION_PROPOSAL]: {
        eventObject: async (proposalId: string): Promise<any> => (await getProposalById(proposalId)).data(),
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        notifyUserFilter: async (proposal: any): Promise<string[]> => {
            const proposalDao = (await getDaoById(proposal.dao)).data();
            const userFilter = proposalDao.members.map(member => {
                return member.userId;
            });
            return userFilter;
        }
    },
    [EVENT_TYPES.CREATION_REQUEST_TO_JOIN]: {
        eventObject: async (proposalId: string): Promise<any> => (await getProposalById(proposalId)).data(),
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        notifyUserFilter: async (proposal: any): Promise<string[]> => {
            return [
              proposal.proposerId
            ];
        }
    },
    [EVENT_TYPES.COMMON_WHITELISTED]: {
        eventObject: async (commonId: string): Promise<any> => (await getDaoById(commonId)).data(),
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        notifyUserFilter: async (dao: any): Promise<string[]> => {
            return [dao.members[0].userId];
        }
    },
    [EVENT_TYPES.APPROVED_FUNDING_REQUEST]: {
        eventObject: async (proposalId: string): Promise<any> => (await getProposalById(proposalId)).data(),
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        notifyUserFilter: async (proposal: any): Promise<string[]> => {
            return [proposal.proposerId];
        }
    },
    [EVENT_TYPES.APPROVED_JOIN_REQUEST]: {
        eventObject: async (proposalId: string): Promise<any> => (await getProposalById(proposalId)).data(),
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        notifyUserFilter: async (proposal: any): Promise<string[]> => {
            return [proposal.proposerId];
        }
    },
    [EVENT_TYPES.REJECTED_FUNDING_REQUEST]: {
        eventObject: async (proposalId: string): Promise<any> => (await getProposalById(proposalId)).data(),
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        notifyUserFilter: async (proposal: any): Promise<string[]> => {
            return [proposal.proposerId];
        }
    },
    [EVENT_TYPES.REJECTED_JOIN_REQUEST]: {
        eventObject: async (proposalId: string): Promise<any> => (await getProposalById(proposalId)).data(),
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        notifyUserFilter: async (proposal: any): Promise<string[]> => {
            return [proposal.proposerId];
        }
    }
    
}