import { CommonLink } from "@/shared/models";

export interface CreateFundingRequestProposalPayload {
  commonId: string;
  title: string;
  description: string;
  amount: number;
  links?: CommonLink[];
  files?: string[];
  images?: CommonLink[];
}
