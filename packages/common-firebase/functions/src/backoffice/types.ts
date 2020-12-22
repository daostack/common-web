
export interface ICircleBalanceBase {
    data: {
        available: any;
        unsettled: any;
    }
}

export type ICircleBalance = ICircleBalanceBase //ISubscriptionPayment | IProposalPayment;