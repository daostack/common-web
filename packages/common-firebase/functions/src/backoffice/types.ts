import { IBaseEntity } from "../util/types";


export interface ICircleBalanceBase extends IBaseEntity {
    id: string;
    account: string;
    available: [];
    unsettled: [];    
}

export interface ICircleBalancePayload {
    data: {
        available: any;
        unsettled: any;
    }
}

export type ICircleBalance = ICircleBalanceBase //ISubscriptionPayment | IProposalPayment;