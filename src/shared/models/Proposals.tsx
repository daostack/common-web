import {
  FundsAllocation,
  FundsRequest,
  MemberAdmittance,
} from "@/shared/models/governance/proposals";
import { DiscussionMessage } from "./DiscussionMessage";
import { VoteOutcome } from "./Votes";
import { User } from "./User";

export enum ProposalFundingState {
  NotRelevant = "notRelevant",
  NotAvailable = "notAvailable",
  Available = "available",
  Funded = "funded",
}

export enum ProposalPaymentState {
  NotAttempted = "notAttempted",
  NotRelevant = "notRelevant",
  Confirmed = "confirmed",
  Pending = "pending",
  Failed = "failed",
}

export enum ProposalState {
  COUNTDOWN = "countdown",
  PASSED = "passed",
  REJECTED = "failed",
  PASSED_INSUFFICIENT_BALANCE = "passedInsufficientBalance",
  EXPIRED_INVOCIES_NOT_UPLOADED = "expiredInvociesNotUploaded",
}

interface ProposalJoin {
  __typename?: "ProposalJoin";
  cardId: string;
  funding: number;
}

export interface DocInfo<LegalType = number> {
  name: string;
  legalType: LegalType;
  amount?: number;
  mimeType: string;
  downloadURL: string;
}

export interface ProposalLink {
  title?: string;
  value: string;
}

export interface Vote {
  voteId: string;
  voteOutcome: VoteOutcome;
  voterId: string;
}

export type Proposal = (MemberAdmittance | FundsRequest | FundsAllocation) & {
  discussionMessage?: DiscussionMessage[];
  proposer?: User;
};

export interface ProposalListItem {
  proposal: Proposal;
  loadProposalDetails: (payload: Proposal) => void;
}

export const isDocInfo = (data: any): data is DocInfo => data.downloadURL;
