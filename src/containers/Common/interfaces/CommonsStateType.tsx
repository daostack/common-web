import { Common, CommonPayment, Discussion, Proposal } from "../../../shared/models";

export interface CommonsStateType {
  commons: Common[];
  common: Common | null;
  commonPayment: CommonPayment | null;
  page: number;
  proposals: Proposal[];
  discussions: Discussion[];
  isDiscussionsLoaded: boolean;
  isProposalsLoaded: boolean;
  isCommonPaymentLoading: boolean;
  currentDiscussion: Discussion | null;
  currentProposal: Proposal | null;
  userProposals: Proposal[];
}
