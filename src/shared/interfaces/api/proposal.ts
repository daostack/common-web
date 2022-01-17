export interface ProposalJoinRequestData {
  commonId: string;
  description: string;
  funding: number;
  cardId?: string;
}
export interface ICommonLink {
  title: string;
  value: string;
}

export interface CreateFundingRequestProposalPayload {
  commonId: string;
  title: string;
  description: string;
  amount: number;
  links?: ICommonLink[];
  files?: string[];
  images?: string[];
}
