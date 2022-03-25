import { CommonLink } from "@/shared/models";

export interface ProposalJoinRequestData {
  commonId: string;
  description: string;
  funding: number;
  cardId?: string;
  links?: CommonLink[];
}

export interface CreateFundingRequestProposalPayload {
  commonId: string;
  title: string;
  description: string;
  amount: number;
  links?: CommonLink[];
  files?: string[];
  images?: CommonLink[];
}
